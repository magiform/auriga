import type { Hook } from "@models/Hook.model"
import { useState } from "preact/hooks"

export default function FormCreate({ hookTypes, requestUrl, token }: { hookTypes: Array<string>, token: string, requestUrl: string }) {
    const [hooks, setHooks] = useState<Hook[]>([])
    const [origins, setOrigins] = useState<string[]>([""])
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const onSubmit = async (ev: Event) => {
        ev.preventDefault()
        if (!name || origins.length === 0 || hooks.length === 0) {
            return
        }
        setLoading(true)
        const res = await fetch(requestUrl, {
            method: "post",
            body: JSON.stringify({ form: { name, allowedOrigins: origins.join(";") }, hooks }),
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
    }
    return (
        <div class="w-96 flex flex-col">
            {loading && <p>loading...</p>}
            {!loading &&
                <form onSubmit={onSubmit}>
                    <label htmlFor="name">Name</label>
                    <input value={name} onInput={(ev) => setName(ev.target.value)} name="name" required />
                    {origins.map((e, idx) => <div class="flex flex-col">
                        <label htmlFor={`origin_${idx}`}>Origin {idx}</label>
                        <input
                            name={`origin_${idx}`}
                            value={e}
                            required
                            onInput={(ev) => setOrigins((old) => {
                                old[idx] = ev.target!.value
                                return [...old];
                            })} />
                        <button
                            class="w-auto"
                            onClick={(ev) => {
                                ev.preventDefault()
                                setOrigins((old) => [...old.filter((ev, index) => index !== idx)])
                            }}>Remove Origin</button>
                    </div>)}
                    <button onClick={(ev) => {
                        ev.preventDefault()
                        setOrigins((old) => [...old, ""])
                    }}>Add Origin</button>
                    {hooks.map((e, idx) => <div class="flex flex-col">
                        <label htmlFor={`type_url`}>Hook Type</label>
                        <select
                            name={`type_${idx}`}
                            onChange={(ev) => {
                                setHooks((old) => {
                                    old[idx].type = ev.target!.value
                                    return old
                                })
                            }}>
                            <option selected={!e.type} disabled>Select Hook Type</option>
                            {hookTypes.map((type) => <option selected={e.type === type} value={type}>{type}</option>)}
                        </select>
                        <label htmlFor={`name_${idx}`}>Name</label>
                        <input
                            value={e.name}
                            onInput={(ev) => setHooks((old) => {
                                old[idx].name = ev.target!.value
                                return [...old]
                            })}
                            type="text"
                            required
                            name={`name_${idx}`} />
                        <label htmlFor={`url_${idx}`}>Url</label>
                        <input
                            value={e.url}
                            onInput={(ev) => setHooks((old) => {
                                old[idx].url = ev.target!.value
                                return [...old]
                            })}
                            type="url"
                            required
                            name={`url_${idx}`} />
                        <button onClick={(ev) => {
                            ev.preventDefault()
                            setHooks((old) => old.filter((i, index) => index !== idx))
                        }}>Remove</button>
                    </div>)}
                    <button onClick={(ev) => {
                        ev.preventDefault()
                        setHooks((old) => ([...old, { url: "", type: "" }]))
                    }}>Add Hook</button>
                    <button type="submit">Create Form</button>
                </form>}
        </div>
    )
}