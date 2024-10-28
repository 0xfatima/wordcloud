
export default function Hero({children}){
return(
    <>
    <section className=" flex p-8 text-white justify-center align-center pt-15">
        <div className='flex flex-col w-4/5 h-80 justify-center align-center gap-5 text-center items-center '>
{children}
        </div>
             </section></>
)
}