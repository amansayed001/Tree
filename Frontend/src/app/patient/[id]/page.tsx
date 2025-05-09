"use client";

import Link from "next/link"
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react"
import { Header } from "@/app/header"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileQuestionIcon, HelpCircle, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PredictionInput {
    userId: string;
    age: number;
    gender: string;
    pregnancies: number;
    glucose: number;
    blood_pressure: number;
    skin_thickness: number;
    insulin: number;
    bmi: number;
    diabetes_pedigree_function: number;
    cholesterol: number;
    resting_bp: number;
    chest_pain_type: number;
    fasting_blood_sugar: number;
    rest_ecg: number;
    max_heart_rate: number;
    exercise_induced_angina: number;
    oldpeak: number;
    slope: number;
    num_major_vessels: number;
    thal: number;
}


interface IBlock {
    _id: string;
    firstName: string;
    lastName: string;
}

interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    childrenIds: IBlock[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    fatherId: {
        _id: string;
        firstName: string;
        lastName: string;
    },
    motherId: {
        _id: string;
        firstName: string;
        lastName: string;
    },
}


export default function Patient() {
    const params = useParams();
    const id = params.id as string;
    const [user, setUser] = useState<IUser>()
    const [loading, setLoading] = useState(false);
    const [predictInput, setPredictInput] = useState<PredictionInput>({
        userId: id,
        age: 0,
        gender: "male",
        pregnancies: 0,
        glucose: 0,
        blood_pressure: 0,
        skin_thickness: 0,
        insulin: 0,
        bmi: 0,
        diabetes_pedigree_function: 0,
        cholesterol: 0,
        resting_bp: 0,
        chest_pain_type: 0,
        fasting_blood_sugar: 0,
        rest_ecg: 0,
        max_heart_rate: 0,
        exercise_induced_angina: 0,
        oldpeak: 0,
        slope: 0,
        num_major_vessels: 0,
        thal: 0
    })

    const predict = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3001/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(predictInput)
            })

            if (!res.ok) {
                throw new Error("operation failed!")
            }

            const data = await res.json()

            const result = `Cancer Risk: ${data.prediction.cancer_risk}; Diabetes Risk: ${data.prediction.diabetes_risk}; Heart Disease Risk: ${data.prediction.heart_disease_risk}`
            alert(result);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log(e)
            alert("operation failed!")
        }
    }

    const update = async (e: React.FormEvent) => {
        e.preventDefault();
      
        if (!user) return;
      
        try {
          const bodyToSend = {
            motherId: user.motherId?._id || null,
            fatherId: user.fatherId?._id || null,
            childrenIds: user.childrenIds?.map(child => child._id) || []
          };

          const res = await fetch("http://localhost:3001/user/" + id, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyToSend)
          });
      
          if (!res.ok) {
            throw new Error("Operation failed!");
          }
      
          const data = await res.json();
      
          setUser(data);
          alert("Patient updated successfully!")
        } catch (e) {
            console.error("Update error:", e)
            if (e instanceof Error) {
                alert(e.message)
            } else {
                alert("Unknown error")
            }
        }
    }


    useEffect(() => {
        (async function() {
            try {
                // getting user details
                const res = await fetch("http://localhost:3001/user/"+id);

                if (!res.ok) {
                    throw new Error("failed to fetch user!")
                }

                const data = await res.json()

                setUser(data)

                // getting last prediction input
                const res2 = await fetch("http://localhost:3001/predictionIn/"+id)

                if (!res2.ok) {
                    throw new Error("No previous prediction input found!")
                }

                const data2 = await res2.json()

                setPredictInput(data2.userInput)
            } catch (e) {
                console.log(e)
                if (e instanceof Error) {
                    alert(e.message)
                } else {
                    alert("failed to fetch user!")
                }
            }
        })()
    }, [])


    if (!user) {
        return (
            <div className="container mx-auto">
                <Header />

                <div className="mt-6">
                    <h1>
                        No Data Yet!
                    </h1>
                </div>
            </div>
        )
    }


    return (
        <div className="container mx-auto lg:w-[80%]">
            <Header />

            <div className="mt-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold">Field</TableHead>
                            <TableHead className="font-semibold">Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">
                                Patient ID
                            </TableCell>
                            <TableCell>
                                {user._id}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">
                                First Name
                            </TableCell>
                            <TableCell>
                                {user.firstName}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">
                                Last Name
                            </TableCell>
                            <TableCell>
                                {user.lastName}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">
                                Created
                            </TableCell>
                            <TableCell>
                                {user.createdAt} 
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">
                                Updated
                            </TableCell>
                            <TableCell>
                                {user.updatedAt}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">
                                Father
                            </TableCell>
                            <TableCell>
                                {
                                    (user.fatherId)
                                    ?
                                    <Link href={`/patient/${user.fatherId._id}`}>
                                        <p className="underline">
                                            {user.fatherId.firstName} {user.fatherId.lastName}
                                        </p>
                                    </Link>
                                    :
                                    "No Data Provided"
                                }
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">
                                Mother
                            </TableCell>
                            <TableCell>
                                {
                                    (user.motherId)
                                    ?
                                    <Link href={`/patient/${user.motherId._id}`}>
                                        <p className="underline">
                                            {user.motherId.firstName} {user.motherId.lastName}
                                        </p>
                                    </Link>
                                    :
                                    "No Data Provided"
                                }
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">
                                Children
                            </TableCell>
                            <TableCell>
                                {
                                    (user.childrenIds.length < 1)
                                    ?
                                    "No Data Provided"
                                    :
                                    <div>
                                        {user.childrenIds.map((c) => (
                                            <Link key={c._id} href={`/patient/${c._id}`}>
                                                <span className="underline mr-2">
                                                    {c.firstName} {c.lastName}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                }
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>


                <div className="mt-8">
                    <h1 className="text-2xl font-semibold mb-2">
                        Predictions
                    </h1>

                    <form onSubmit={predict} className="mt-2">
                        <div>
                            <Label>Age</Label>
                            <Input min={1} max={125} placeholder="Enter a value from 1–125" type="number"
                            value={predictInput.age === 0 ? '' : predictInput.age}
                            onFocus={(e) => predictInput.age === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, age: Number(e.target.value) }))}
                            required
                            />

                            <Label className="mt-2">Gender</Label>
                            <Select value={predictInput.gender} onValueChange={(nv) => setPredictInput(prev => ({...prev, gender: nv}))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {predictInput.gender === "female" && (
                                <>
                                    <Label className="mt-2">Pregnancies</Label>
                                    <Input min={0} max={100} placeholder="Enter a value from 0 onwards" type="number"
                                    value={predictInput.pregnancies === 0 ? '' : predictInput.pregnancies}
                                    onFocus={(e) => predictInput.pregnancies === 0 && (e.target.value = '')}
                                    onChange={(e) => setPredictInput(prev => ({ ...prev, pregnancies: Number(e.target.value) }))}
                                    required
                                    />
                                </>
                            )}
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1 mt-2">
                                        <Label className="mt-2">Glucose (mg/dL)</Label>
                                        <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                                    </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small>Add text</small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={0} max={500} placeholder="Enter a value from 0-500" type="number"
                            value={predictInput.glucose === 0 ? '' : predictInput.glucose}
                            onFocus={(e) => predictInput.glucose === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, glucose: Number(e.target.value) }))}
                            required
                            />
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label className="mt-2">Blood Pressure Systolic (mm Hg)</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small>Add text</small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={60} max={260} placeholder="Enter a value from 60-260" type="number"
                            value={predictInput.blood_pressure === 0 ? '' : predictInput.blood_pressure}
                            onFocus={(e) => predictInput.blood_pressure === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, blood_pressure: Number(e.target.value) }))}
                            required
                            />

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label className="mt-2">Blood Pressure Diastolic</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small>BloodPressure (Diastolic)</small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={40} max={220} placeholder="Enter a value from 40–220" type="number"
                            value={predictInput.resting_bp === 0 ? '' : predictInput.resting_bp}
                            onFocus={(e) => predictInput.resting_bp === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, resting_bp: Number(e.target.value) }))}
                            required
                            />

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1 mt-2">
                                        <Label className="mt-2">Skinfold Thickness (mm)</Label>
                                        <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                                    </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small></small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={2} max={99} placeholder="Enter a value from 2–99" type="number"
                            value={predictInput.skin_thickness === 0 ? '' : predictInput.skin_thickness}
                            onFocus={(e) => predictInput.skin_thickness === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, skin_thickness: Number(e.target.value) }))}
                            required
                            />

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label className="mt-2">Insulin (mu U/mL)</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small>Add text</small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={0} max={846} placeholder="Enter a value from 0 onwards" type="number"
                            onFocus={(e) => predictInput.insulin === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, insulin: Number(e.target.value) }))}
                            required
                            />

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label className="mt-2">Body Mass Index (kg/m²)</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small>Add text</small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={0} max={68} placeholder="Enter a value from 0–68" type="number"
                            onFocus={(e) => predictInput.bmi === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, bmi: Number(e.target.value) }))}
                            required
                            />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1 mt-2">
                                        <Label className="mt-2">Diabetes Pedigree Function</Label>
                                        <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                                    </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small>The Diabetes Pedigree Function (DPF) is a value that quantifies a person's genetic predisposition to diabetes based on family history.</small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={0} max={2.5} placeholder="Enter a value from 0.0–2.5" type="number"
                            onFocus={(e) => predictInput.diabetes_pedigree_function === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, diabetes_pedigree_function: Number(e.target.value) }))}
                            required
                            />

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label className="mt-2">Cholesterol (mg/dL)</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small>Add text</small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={0} max={600} placeholder="Enter a value from 0–600" type="number"
                            onFocus={(e) => predictInput.cholesterol === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, cholesterol: Number(e.target.value) }))}
                            required
                            />

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1 mt-2">
                                        <Label className="mt-2">Chest Pain Type</Label>
                                        <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                                    </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small>Add text</small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={0} max={3} placeholder="Enter a value from 0–3" type="number"
                            onFocus={(e) => predictInput.chest_pain_type === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, chest_pain_type: Number(e.target.value) }))}
                            required
                            />

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label className="mt-2">Fasting Blood Sugar(0 = no, 1 = yes)</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small> Fasting Blood Sugar {">"} 120 mg/dl (1 = true, 0 = false)</small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={0} max={1} placeholder="Enter 0 or 1" type="number"
                            
                            onFocus={(e) => predictInput.fasting_blood_sugar === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, fasting_blood_sugar: Number(e.target.value) }))}
                            required
                            />

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label className="mt-2">Rest ECG</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small>Resting ECG results (0, 1, 2)</small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={0} max={2} placeholder="Enter a value from 0–2" type="number"
                            onFocus={(e) => predictInput.rest_ecg === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, rest_ecg: Number(e.target.value) }))}
                            required
                            />

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label className="mt-2">Max Heart Rate</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small>Maximum heart rate achieved</small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={60} max={210} placeholder="Enter a value from 60–210" type="number"
                            value={predictInput.max_heart_rate === 0 ? '' : predictInput.max_heart_rate}
                            onFocus={(e) => predictInput.max_heart_rate === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, max_heart_rate: Number(e.target.value) }))}
                            required
                            />

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1 mt-2">
                                        <Label className="mt-2">Exercise Induced Angina(0 = no, 1 = yes)</Label>
                                        <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                                    </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small>Exercise-induced angina (1 = yes, 0 = no)</small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={0} max={1} placeholder="Enter 0 or 1" type="number"

                            onFocus={(e) => predictInput.exercise_induced_angina === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, exercise_induced_angina: Number(e.target.value) }))}
                            required
                            />

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1 mt-2">
                                        <Label className="mt-2">Old peak (mm)</Label>
                                        <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                                    </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small>ST depression induced by exercise</small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={0} max={7.0} placeholder="Enter a value from 0.0–7.0" type="number"
                            onFocus={(e) => predictInput.oldpeak === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, oldpeak: Number(e.target.value) }))}
                            required
                            />

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1 mt-2">
                                        <Label className="mt-2">Slope</Label>
                                        <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                                    </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small> Slope of the ST segment</small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={1} max={3} placeholder="Enter a value from 1–3" type="number"
                            onFocus={(e) => predictInput.slope === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, slope: Number(e.target.value) }))}
                            required
                            />
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1 mt-2">
                                        <Label className="mt-2">Thal</Label>
                                        <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                                    </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <small>Thalassemia (1, 2, 3+)</small>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input min={1} max={7} placeholder="Enter a value from 1–7" type="number"
                            value={predictInput.thal === 0 ? '' : predictInput.thal}
                            onFocus={(e) => predictInput.thal === 0 && (e.target.value = '')}
                            onChange={(e) => setPredictInput(prev => ({ ...prev, thal: Number(e.target.value) }))}
                            required
                            />
                        </div>

                        <div className="my-4">
                            <h2 className="text-lg">
                                <Link href="https://www.nhs.uk/live-well/" target="_blank"><span className="text-blue-400">Click here to Visit NHS Website for tips on how to lead a healthy life-style</span></Link>
                            </h2>
                        </div>

                        <div className="mt-6">
                            {
                                (loading)
                                ?
                                <Button disabled>
                                    <Loader2 className="h-4 w-4 animate-spin"/> Loading
                                </Button>
                                :
                                <Button type="submit">
                                    Predict
                                </Button>
                            }
                        </div>
                    </form>
                </div>

                <div className="mt-8">
                    <h1 className="text-2xl font-semibold mb-2">
                        Update Details
                    </h1>

                    <form onSubmit={update} className="mt-2">
                        <Label className="mt-2">Father&apos;s ID</Label>
                        <Input 
                            type="text"
                            className="mb-2"
                            value={(user && user.fatherId) ? user.fatherId._id : ""}
                            onChange={(e) => setUser(prev => {
                                if (!prev) return prev; // if prev is undefined, do nothing
                              
                                return {
                                  ...prev,
                                  fatherId: {
                                    ...prev.fatherId, // preserve firstName, lastName
                                    _id: e.target.value
                                  }
                                };
                            })}
                        />
                        <Label className="mt-2">Mother&apos;s ID</Label>
                        <Input 
                            type="text"
                            className="mb-2"
                            value={(user && user.motherId) ? user.motherId._id : ""}
                            onChange={(e) => setUser(prev => {
                                if (!prev) return prev; // if prev is undefined, do nothing
                              
                                return {
                                  ...prev,
                                  motherId: {
                                    ...prev.motherId, // preserve firstName, lastName
                                    _id: e.target.value
                                  }
                                };
                            })}
                        />
                        <Label className="mt-2">Children IDs (comma seperated)</Label>
                        <Input 
                            type="text"
                            className="mb-2"
                            value={(user && user.childrenIds.length > 0) 
                                ? user.childrenIds.map(child => child._id).join(",") 
                                : ""}
                            onChange={(e) => setUser(prev => {
                                if (!prev) return prev;

                                const inputString = e.target.value;
                                const idsArray = inputString.split(',')
                                .map(id => id.trim())
                                .filter(id => id.length > 0);

                                const childrenObjects = idsArray.map(id => ({
                                    _id: id,
                                    firstName: "",
                                    lastName: ""
                                }));

                                return {
                                    ...prev,
                                    childrenIds: childrenObjects
                                };
                            })}
                        />

                        <div className="mt-6">
                            <Button type="submit">
                                Update
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

