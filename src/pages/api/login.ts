import type { APIRoute } from "astro";

export const post: APIRoute = async({request, redirect, cookies}) =>  {
    const form = await request.formData()
    const data = {
        email: form.get("email"),
        password: form.get("password")
    }
    const res = await fetch(`${import.meta.env.API_URL}/auth/login`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) return redirect("/login")
    const {access_token} = await res.json()
    console.log(access_token)
    await cookies.set("token", access_token, {path:"/"})
    return redirect("/app")
}