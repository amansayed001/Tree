"use client"

import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Header } from "../header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"



export default function CreatePatients() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (firstName.trim().length < 1 || lastName.trim().length < 1) {
            alert("both fields are required!")
            return
        }

        const payload = {
            firstName: firstName.trim(),
            lastName: lastName.trim()
        }

        try {
            const res = await fetch("http://localhost:3001/user/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                throw new Error("failed to create!")
            }

            location.replace("/")
        } catch (e) {
            console.log(e)
            alert("failed to create!")
        }
    }

    return (
        <div className="container mx-auto lg:w-[80%]">
            <Header />

            <div className="w-[400px] p-2 mx-auto">
                <h1 className="text-xl text-center font-semibold">Create Patient Record</h1>

                <form onSubmit={submit} className="mt-2">
                    <div className="mt-2">
                        <Label htmlFor="firstName">
                            Enter First Name
                        </Label>
                        <Input 
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="lastName">
                            Enter Last Name
                        </Label>
                        <Input 
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mt-3">
                        <Button type="submit">
                            Create
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
