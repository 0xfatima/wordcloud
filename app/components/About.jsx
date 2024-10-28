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
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing FastApi API&nbsp;
          <Link href="/api/py/helloFastApi">
            <code className="font-mono font-bold">api/index.py</code>
          </Link>
        </p>
            </div>
            
        </section>
    )
}