
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "@tanstack/react-query";
import { z, ZodSchema } from "zod";

export const useZodFormhook = (schema:ZodSchema, 
    mutation?:UseMutateFunction
    ,defaultValues?:Partial<z.infer<typeof schema>>)=>{

    const {handleSubmit,
        register,
        watch,
        reset,
        formState:{errors,isValid}
    } = useForm<z.infer<typeof schema>>({
        resolver:zodResolver(schema),
        defaultValues:{...defaultValues}    
    })

    const onFormSubmit = mutation? handleSubmit(async(values)=>{
        console.log('form is submitted ')
            mutation({...values})
    }):undefined
return {
    register, watch , reset, isValid, errors, handleSubmit, ...(onFormSubmit && {onFormSubmit})
}

}