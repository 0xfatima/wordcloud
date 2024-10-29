"use client"
import Hero from './HeroSection'
import { useState } from 'react'
import Navbar from './Navbar';
export default function Uploader(){
    
    const [selectedFile,setSelectedFile]= useState(null);
    const [wordcloudImage,setWordcloudImage]= useState(null)
    const handleFileChange =(event)=>{
        const file = event.target.files[0]
        if(file && file.type =="application/pdf" ){
            setSelectedFile(file)
        }
    } 

    const handleUpload=async()=>{
        const formData= new FormData();
    formData.append('file', selectedFile)

    try{
        const response = await fetch("/api/py/generate-wordcloud/",{

            method:"POST",
            body:formData
        })

        if(response.ok){
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setWordcloudImage(url)
            alert("image generated successfully")
        }else{
            alert("error generating image")
        }
    }catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file.');
    }

    }
    return(
        <>
        <section className='pb-10 Hero'>
        <Navbar/>
        <Hero>
       
       <h2 className="text-4xl font-bold mb-4 ">Upload a PDF</h2>
            <div className=' flex flex-col w-1/3 h-1/2 border-2 border-dashed border-red 
            justify-center items-center align-center rounded-md'>
                
                <label htmlFor="file-upload" 
                className='mx-auto hover:bg-blue-400 bg-blue-500 w-1/2 p-3 text-center rounded-md cursor-pointer'>
        {selectedFile?"Select another File":"select a file"}
          </label>
        <input id="file-upload"
                type="file" 
                accept="application/pdf"
                className="invisible absolute "
                onChange={handleFileChange}
                />
             </div> 
             
             {selectedFile && (
                <>
                        <p className="mt-4 text-blue-900 font-bold">
                            Uploaded: {selectedFile.name}
                        </p>
                        <button onClick={handleUpload} className='hover:bg-blue-400 bg-blue-500 w-1/4 p-3 text-center rounded-md'>Convert</button>
                        </>
                    )}


      
        </Hero>
        {wordcloudImage && (
                        <div className="flex flex-col mt-4 justify-center items-center">
                            <h3 className="text-xl font-bold">Generated Word Cloud:</h3>
                            <img src={wordcloudImage} alt="Generated Word Cloud" className="mt-2 border rounded" />
                        </div>
                    )}    
        </section>
        
             </>
)
}