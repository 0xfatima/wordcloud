import Question from "./Question"
export default function FAQs(){
    return(
        <section className=" bg-transparent white-glassmorphism relative">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"
className="absolute -top-36 left-0 z-0"
><path fill="#ffffff" fillOpacity="1"
 d="M0,192L80,186.7C160,181,320,171,480,186.7C640,203,800,245,960,250.7C1120,256,1280,224,1360,208L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>

            
            <div className="faq-color flex justify-center items-center py-20  px-10" >
            <div className="w-4/5 mt- ">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Got Questions? We've Got Answers!</h1>
            <h3 className="text-2xl font-bold">Your Curiosity, Our Passion!</h3>
            <p>At [Your Company Name], we love to connect with
                 you and clarify your doubts! Below are some of 
                 the most frequently asked questions from our community.
                  Don't hesitate to reach out if you need more info or
                   have something else on your mind!</p></div>
            <div className="flex flex-col gap-2 pt-5  pb-20"> 
               <Question question="What magic do you offer?"
                answer=" We specialize in an array of enchanting services, 
               from custom software development and eye-catching web design 
               to innovative mobile app solutions and strategic digital marketing."/>
               <Question question="How do I get a tailor-made quote for my project?" 
               answer=" Getting a personalized quote is as easy as pie!
                Just fill out our quick online form 
               or reach out to our friendly sales team, and we'll whip 
               up a customized proposal that fits your vision."/>
               <Question question="What happens after my project goes live?"
                answer="  Our journey doesn't end at launch! We offer dedicated support
                 and maintenance services to ensure your project runs smoothly and 
                 continues to dazzle your audience."/>

            </div>
            </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"
 className="absolute bottom-0 right-0 pt-20" 
><path fill="#ffffff" 
fillOpacity="1"
 d="M0,192L80,186.7C160,181,320,171,480,186.7C640,203,800,245,960,250.7C1120,256,1280,224,1360,208L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>   
          
        </section>
    )
}