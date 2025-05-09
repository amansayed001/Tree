"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Header } from "./header"


interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}


export default function Home() {
  const [searchInput, setSearchInput] = useState("")
  const [allUsers, setAllUsers] = useState<IUser[]>([])
  const [users, setUsers] = useState<IUser[]>([])

  const search = () => {
    const cleanInput = searchInput.trim().toLowerCase();

    if (cleanInput.length < 1) {
      setUsers(allUsers)
      return;
    }

    const filtered = allUsers.filter(user =>
      user.firstName.toLowerCase().includes(cleanInput) ||
      user.lastName.toLowerCase().includes(cleanInput)
    );

    setUsers(filtered);
  }

  useEffect(() => {
    (async function() {
      try {
        const data = await fetch("http://localhost:3001/users");

        if (data.status !== 200) {
          throw new Error("Failed to fetch patients!")
        }

        const parsedData = await data.json()

        setAllUsers(parsedData)
        setUsers(parsedData)
      } catch (e) {
        console.error(e)
        alert("Failed to fetch patients!")
      }
    })()
  }, [])


  return (
    <div className="container mx-auto lg:w-[80%]">
      <Header />

      <div>
        <Label htmlFor="search">
          Search Patient
        </Label>
        <Input 
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        

        <div>
          <Button className="mt-2" onClick={search}>
            Search
          </Button>

          <Link href="/createPatient">
            <Button className="mt-2 ml-3" variant="secondary" onClick={search}>
              Create New Patient
            </Button>
          </Link>
        </div>
      </div>


      <div className="border-t mt-4 py-4">
        {
          (!users || users.length < 1)
          ?
          <div>
            <p className="text-sm text-center py-6">
              No Patient!
            </p>
          </div>
          :
          <>
            {users.map((user) => (
              <Link key={user._id} href={`/patient/${user._id}`}>
                <div className="border-b p-2">
                  <p className="text-md font-semibold py-2 capitalize">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm">
                    Patient Id: {user._id}
                  </p>
                  <p className="text-sm">
                    Created: {user.createdAt}
                  </p>
                </div>
              </Link>
            ))}
          </>
        }
      </div>
    </div>
  )
}
