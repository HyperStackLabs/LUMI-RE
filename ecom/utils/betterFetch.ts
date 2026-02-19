export default async function betterFetch(url: string, options: RequestInit){
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Something went wrong' }))
        throw new Error(error.message || `Error ${response.status}`)
    }
    return response
}