import Content from './Content'
export default function Footer(){
    return(
        <section className="flex flex-row justify-around pt-20 pb-10 px-10 footer-color ">
           <div className='w-1/2 '>
            <Content heading="Let's Stay Connected!"
            subheading="Join the [Your Company Name] Community!"
            paragraph='Be the first to know about our latest innovations,
                 exclusive offers, and industry insights! Sign up 
                 for our newsletter and follow us on social media to
                  join a vibrant community that thrives on creativity
                   and collaboration. '
                class='text-white text-opacity-60'
            />
           
           </div>
           <div>
                <ul className='flex flex-col gap-2 justify-center align-center '>
                    <li className='text-white text-opacity-60'>Contact Us: Wordwave@gmail.com</li>
                    <li className='text-white text-opacity-60'>Follow Us: [Social Media Links]</li>
                    <li className='text-white text-opacity-60'>Explore: [Privacy Policy] | [Terms of Service]</li>
                </ul>
           </div>
        </section>
    )
} 