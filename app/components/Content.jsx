export default function Content(props){
    return(
        <div className="flex flex-col justify-center align-center gap-2">
            <h1 className={`text-3xl font-bold ${props.class}`}>{props.heading}</h1>
                <h3 className={`text-2xl font-bold ${props.class}`}>{props.subheading}</h3>
                <p className={`w-5/6 ${props.class}`}>{props.paragraph}</p>
        </div>
    )
}