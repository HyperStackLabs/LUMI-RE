import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { Response, Request } from "express"
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { verifyToken, AuthRequest } from './middleware/tokenVerify'
import stripe from 'stripe'
const app = express()
app.use(express.json({limit: '16mb'}))
app.use(cookieParser())
const stripeCall = new stripe(process.env.STRIPE_KEY)

mongoose.connect(process.env.MONGO_URL)
const productSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    collection: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    specs: { type: String, required: true },
    comments: {type: [{id: String, author: String, title: String, profilePicture: String, rating: Number, date: String, content: String, likes: [String]}]},
    rating: { type: Number, default: 0 }
});
const userSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    id: {type: String, required: true},
    password: {type: String, required: true},
    profilePicture: {type: String, default: ''},
    bio: {type: String, default: ''},
    OrderHistory: {type: [{ProductName: String, price: Number}], default: []},
    cart: {type: [{
      id: String,
      name: String,
      price: Number,
      collection: String,
      image: String,
      quantity: {type: Number, default: 1}
    }], default: []}
})
const users = mongoose.model('users', userSchema)
const products = mongoose.model('products', productSchema)

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.get('/verify-token', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const token = req.cookies.token;
        if (!token) {
           return res.status(401).json({ message: 'No token provided.' });
        }
        let user = await users.findOne({ id: req.user.id });
        if (!user) return res.status(404).json({ message: 'No User Found.' });
        return res.json(user);
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
})
app.post('/auth/signup', async (req: Request, res: Response) => {
    try{
        const {fullName, email, password, profilePicture, bio, id} = req.body
        const emailExists = await users.findOne({email})
        const nameExists = await users.findOne({fullName})
        if(nameExists || emailExists){
           return res.status(409).json({message: 'Your email and name is already taken.'})
        }
        const newUser = new users({
            fullName,
            email,
            password: await bcrypt.hash(password, 10),
            bio: bio || '',
            profilePicture: profilePicture || '',
            OrderHistory: [],
            cart: [],
            id
        })
        await newUser.save()
        return res.status(201).json({message: 'User added successfully'})
    }catch(error){
        console.log(req.body)
        console.log(error)
        return res.status(500).json({message: "Something went wrong with the server."})
    }
})
app.post('/auth/login', async (req: Request, res: Response) => {
    try{
        const {email, password, rememberMe} = req.body
        const foundUser = await users.findOne({email})
        const passwordMatched = await bcrypt.compare(password, foundUser.password)
        if(!foundUser || !passwordMatched || email !== foundUser.email){
            return res.status(404).json({'message': "Incorrect email or password."})
        }
        const token = jwt.sign({id: foundUser.id, email: foundUser.email}, process.env.JWT_TOKEN)
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: rememberMe && 10 * 365 * 24 * 60 * 60 * 1000
        })
        res.status(200).json(foundUser)
    }catch(error){
        return res.status(500).json({message: "Something went wrong with the server."})
    }
})
app.post('/auth/logout', verifyToken, async (req: AuthRequest, res: Response) => {
    const token = req.cookies.token
    try{
        res.clearCookie('token', {
            sameSite: 'lax',
            secure: false,
            httpOnly: true
        })
        return res.status(200).json({token})
    }catch(error){
        return res.status(500).json({message: "Something went wrong with the server."})
    }
})
app.patch('/change-profile', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const id = req.user.id
        const {bio, userName, profilePicture} = req.body
        const anotherUser = await users.findOne({fullName: userName})

        const user = await users.findOne({id})
        if(!user) return res.status(404).json({message: "User not found"})
        
        if(bio) user.bio = bio
        if(userName && !anotherUser) user.fullName = userName
        if(profilePicture) user.profilePicture = profilePicture
        await user.save()
        return res.status(200).json({message: "Profile updated successfully", user})
    } catch(error) {
        console.log(error)
        return res.status(500).json({message: "Error updating profile", error})
    }
})
app.patch('/change-password', verifyToken, async (req: AuthRequest, res: Response) => {
    try{
        const id = req.user.id
        const {password, newPassword} = req.body

        const user = await users.findOne({id})
        console.log(user)
        if(!user) return res.status(404).json({message: 'User not found'})
        
        const isTheSame = await bcrypt.compare(password, user.password)
        console.log(isTheSame)
        if(!isTheSame) return res.status(401).json({message: 'Incorrect password.'})
        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()
        return res.status(200).json({message: 'Successfully changed the password.'})
    }catch(error){
        return res.status(500).json({message: "Error updating password"})
    }
})
app.post('/products/:type', async (req: AuthRequest, res: Response) => {
    try{
        const {type} = req.body
        if(['watch', 'clothing', 'jewelry'].includes(type)){
            const specifiedProductList = await products.find({type})
            res.json(specifiedProductList)
        }
        return res.status(404).json({message: 'No idea what that is.'})
    }catch(error){
        return res.status(500).json({message: "Yikes! Something's up with the servers or something."})
    }
})
app.get('/cart', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const id = req.user.id
        const foundUser = await users.findOne({ id })
        console.log(foundUser.cart)
        if (!foundUser) return res.status(404).json({ message: 'User not found' })
        return res.status(200).json(foundUser.cart)
    } catch (error) {
        return res.status(500).json({ message: "Server error" })
    }
})
app.post('/cart', verifyToken, async (req: AuthRequest, res: Response) => {
    try{
        const id = req.user.id
        let {product, quantity} = req.body
        const foundUser = await users.findOne({id})
        const existingItemIndex = foundUser.cart.findIndex((item: any) => item.id === product.id)
        if(!product || !foundUser) return res.status(404).json({message: `There's nothing here, pal.`})
            
        if(existingItemIndex > -1){
            foundUser.cart[existingItemIndex].quantity += quantity
        }else{
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            collection: product.collection,
            image: product.images?.[0],
            quantity
        }
        foundUser.cart.push(cartItem)
        }
        await foundUser.save()
    }catch(error){
        console.log(error)
        return res.status(500).json({message: "Yikes! Something's up with the servers or something."})
    }
})
app.delete('/cart', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const id = req.user.id
        const {productID} = req.body
        const foundUser = await users.findOne({id})
        if(!foundUser) return res.status(404).json({message: 'User not found'})
        foundUser.cart.pull({id: productID})
        await foundUser.save()
        return res.status(200).json({message: 'Item removed from cart', cart: foundUser.cart})
    } catch(error) {
        console.log(error)
        return res.status(500).json({message: "Error removing from cart", error})
    }
})
app.post('/checkout', verifyToken, async (req: AuthRequest, res: Response) => {
    try{
        const id = req.user.id
        const user = await users.findOne({id})
        const session = await stripeCall.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: user.cart.map(item => ({
                price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    images: [item.image]
                },
                unit_amount: item.price * 100
                },
                quantity: item.quantity
            })),
            mode: 'payment',
            success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000',
            metadata: {
                userId: id
            }
        })
        return res.status(201).json({url: session.url})
    }catch(error) {
        console.log(error)
        return res.status(500).json({message: "Error removing from cart", error})
    }
})
app.get('/checkout-session', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ message: 'Missing session_id' });
    }
    const session = await stripeCall.checkout.sessions.retrieve(
      session_id as string,
      {
        expand: ['line_items', 'line_items.data.price.product'],
      }
    );
    if (session.payment_status !== 'paid') {
      return res.status(403).json({ message: 'Payment not completed' });
    }
    const userId = session.metadata?.userId;
    if (userId) {
      const user = await users.findOne({ id: userId });
      if (user) {
        if (user.cart.length > 0) {
           const newHistory = session.line_items?.data.map((item: any) => ({
             ProductName: item.description,
             price: item.amount_total / 100
           })) || [];
           
           user.OrderHistory.push(...newHistory);
           user.cart.splice(0, user.cart.length);
           await user.save();   
        }
      }
    }
    res.json({
      id: session.id,
      total: session.amount_total! / 100,
      currency: session.currency,
      items: session.line_items?.data.map((item: any) => ({
        name: item.description,
        quantity: item.quantity,
        price: item.amount_total! / 100,
        images: item.price?.product?.images || []
      })),
    });

  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: 'Failed to retrieve session' });
  }
});
app.post('/product-details/:id', verifyToken, async (req: AuthRequest, res: Response) => {
    try{
        const {id} = req.user
        const productId = req.params.id
        const user = await users.findOne({id})
        const product = await products.findOne({id: productId})
        const {title, rating, content, date} = req.body
        if(!product){
            return res.status(404).json({message: 'Product not found.'})
        }
        product.comments.push({
            author: user.fullName, 
            title, 
            profilePicture: user.profilePicture || "",
            rating: Number(rating.toFixed(1)), 
            content, 
            date
        })
        const totalStars = product.comments.reduce((acc: number, item: any) => acc + (item.rating || 0), 0)
        const count = product.comments.length;
        const newAverage = count > 0 ? totalStars / count : 0;
        product.rating = parseFloat(newAverage.toFixed(1));
        await product.save()
        return res.status(200).json({message: "Review added successfully"})

    }catch(error){
        console.log(error)
        return res.status(500).json({message: "Error adding review", error})
    }
})
app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`)
})