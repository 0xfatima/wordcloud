import Image from 'next/image'
export default function NewContent(){
    return(
        <section className="mt-28 py-10 px-10 flex items-end w-full ">

            <div className="relative bg-cover bg-center bg-no-repeat h-40 w-full "
                style={{ backgroundImage: "url('/banner.png')" }}>
                            <Image src="/ComingSoon.png" alt="overlayimage" height={10} width={400} className="absolute  left-10 transform -translate-y-1/2 z-1000" />

                <div className='absolute right-10 bottom-12'>
                    <h3 className='text-2xl font-bold'>Elevate Your Business to New Heights!</h3>
                <p className='text-1xl font-bold'>Unlock Your Free Consultation</p></div>
            </div>
            
        </section>
    )
}