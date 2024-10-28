import Image from 'next/image'
import Link from 'next/link'
export default function Navbar(){
    return(
        <nav className='bg-transparent white-glassmorphism flex flex-row justify-between px-7 py-3'>
        <div className=''>
           <Link href="/">
           <Image
             src='/wordwave-logo.png' // Path to the image
             alt="Description of the image" // Provide a descriptive alt text
             width={80} // Specify the width
             height={60} // Specify the height
            
             />
             </Link>
        </div>
        <div>
            <ul className='flex flex-row gap-3 mt-3 '>
                <Link href="/"><li>home</li></Link>
                <Link href="pdf-to-wordcloud"><li>pdf-to-wc</li></Link>
                <li>login</li>
                <li>sign up</li>
            </ul>
        </div>
    </nav>
    )
}