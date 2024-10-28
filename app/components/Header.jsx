import Link from 'next/link'
import Hero from './HeroSection'
import Navbar from './Navbar'
export default function Header(){
    return(
        <section className='Hero'>
         <Navbar/>
        <Hero>
            
        <div>
        <h1 className="text-4xl font-bold ">Empower Your Ideas with Our Innovative Solutions</h1>
        <h3 className="text-2xl font-bold ">Transforming Visions into Reality with Cutting-Edge Technology</h3>
        </div>
            <p>At Word waves, we believe in harnessing the power of technology to bring your ideas to life. Our team of experts is dedicated to delivering high-quality, tailored solutions that not only meet your unique needs but also exceed your expectations. Whether you’re a startup looking to launch your first product or an established business aiming to innovate, we are here to guide you every step of the way. Join us in revolutionizing the way you think about technology and discover the endless possibilities!</p>
            <Link href="/pdf-to-wordcloud"><button className=" mx-auto hover:bg-blue-400 w-64 h-12 rounded-md bg-blue-500">Convert pdf to Wordcloud</button></Link>
        </Hero>
             </section>
)
}