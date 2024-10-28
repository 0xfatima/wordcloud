import Content from './Content'
export default function About(){
    return(
        <section className="flex flex-row justify-around pt-20 px-10 relative z-50">
            <div className="w-1/2">
                <video src="/person-on-computer.mp4"  muted loop autoPlay 
                className="h-3/4 w-auto"/>
            </div>
            <div className="w-1/2 flex flex-col justify-center align-center gap-2">
                <Content
                heading="Who We Are"
                subheading="Your Ultimate Partner in Digital Brilliance!"
                paragraph="we are a powerhouse of creativity and innovation.
                     Our mission? To empower you with tailor-made solutions that make waves
                      in your industry. Our dynamic team, fueled by passion and expertise,
                       thrives on challenges, turning them into remarkable opportunities for growth.
                        We envision a world where technology ignites your potential and drives 
                        your success. Join us, and lets embark on a thrilling adventure toward
                         a digital future where the possibilities are limitless!"
                />
            </div>
            
        </section>
    )
}