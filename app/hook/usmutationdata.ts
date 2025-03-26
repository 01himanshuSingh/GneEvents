import { useMutation, useQueryClient, MutationKey, MutationFunction } from "@tanstack/react-query";
interface useMutationDataProps{
    mutationKey:MutationKey,
    mutationFn: MutationFunction<any, any>
    queryKey?:string,
    onSuccess?:()=>void
    onError?:(error:any)=>void
}

const useMutationData= ({mutationKey, mutationFn,queryKey, onSuccess, onError}:useMutationDataProps)=>{
const queryClient = useQueryClient()
const {isPending, data, mutate} = useMutation({
    mutationKey,
    mutationFn,
    onSuccess:()=>{
        if(onSuccess) onSuccess()
    },
onError:(error:any)=>{
    console.log('Mutation Error', error)
    let errorMessage = 'An message unexpected occurred'
    if(onError) onError(errorMessage)
},
onSettled: async()=>{
    if(queryKey){
        await queryClient.invalidateQueries({queryKey:[queryKey]})
    }
},
})
return {mutate, isPending, data}
}
export default useMutationData