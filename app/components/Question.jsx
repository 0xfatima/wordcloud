export default function Question(props){
    return(
        <div>
        <h4><span className="font-bold">Q:</span>{props.question}</h4>
        <h4><span className="font-bold">A:</span>{props.answer}</h4>
        </div>
    )
}