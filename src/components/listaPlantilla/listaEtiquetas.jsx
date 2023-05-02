//Dependencias
import { useContext, useEffect, useState } from "react";
import { EtiquetaContext } from "../context/EtiquetaContext";
import { motion } from 'framer-motion'

//Componentes
import { Title } from "./Title";
import { Instrucciones } from "./Instrucciones";
import { Toaster, toast } from 'sonner'

//Styls 
import "../../../public/css/ListStyle.css";

export const ListaEtiqueta = () => {
    const { ordernarId } = useContext(EtiquetaContext);
    const [etiquetaDelete, setEtiquetaDelete] = useState({
        id:"",
        name:"",
        estado:false
    });
    const [etiquetaPrint, SetEtiquetaPrint] = useState({id:"",estado:false})   
    const variants = {
        hidden: {
          opacity: 0
        },
        visible: ({ delay }) => ({
          opacity: 1,
          transition: {
            delay,
            duration: 1
          }
        })
    }
    async function fetchMethod(apiDel, settings) {
        console.log(apiDel);
        const response = await fetch(apiDel, settings)
        return await response.json()
    } 

    useEffect(()=>{
        if (etiquetaDelete.estado === true) {
            const apiUrl = `http://localhost:5000/etiquetas/${etiquetaDelete.id}`
            const settings = {
                method: "Delete",
            }
            fetchMethod(apiUrl, settings)
                .then(response => console.log(response.json))
                .catch(error => console.log(error))
            toast.message(`Eliminaste la Etiqueta:`, {
                description: ` - ${etiquetaDelete.name} -`,
                style: {
                    borderTop : '5px solid red',
                    }
            })
            setEtiquetaDelete({id:"",name:"",estado:false})
        }
    },[etiquetaDelete.estado]);

    useEffect(()=> {
        if (etiquetaPrint.estado === true) {
            console.log("Me ejecute");
            const apiUrl = `http://localhost:5000/etiquetas/imprimir/${etiquetaPrint.id}`
            const settings = {
                method: "GET",
            }
            fetchMethod(apiUrl, settings)
            .then(response => console.log(response.json))
            .catch((error) => {
                toast.error(`Sin conexión al server ... 🖶`, {
                    style: {
                        borderTop : '5px solid red',
                        fontSize: "20px",
                        transition: "all 0.3s"
                        }
                })
                return console.log(`Error Capturado Fuera de la función async: ${error}`)
            });

            toast.success(`🖶   Imprimiendo etiqueta... 🖶`, {
                style: {
                    borderTop : '5px solid green',
                    fontSize: "20px",
                    transition: "all 0.3s"
                    }
            })
            SetEtiquetaPrint({id:"",estado:false})
        }
    }, [etiquetaPrint.estado])
    

    return (
        <>
            <Title textTile={"Imprimir Etiqueta"} subTitle={"Seleccione la etiqueta que desea Imprimir"}/>
            <div className="box-cards">
            <Toaster position="top-left"/>
                <form onSubmit={(e) => e.preventDefault()}>
                
                {ordernarId.map((etiqueta, index) => {
                    return (
                        <motion.div
                        custom={{ delay: (index + 1) * 0.1 }}
                        initial='hidden'
                        animate='visible'
                        exit='hidden'
                        variants={variants}
                        layoutId={etiqueta.id}
                        key={etiqueta.id}
                        >
                            <article className="card">
                                <figure>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 list" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </figure>

                                <div className="box-card">
                                    <div>
                                        <h3>{etiqueta.nameEtiqueta != null ? etiqueta.nameEtiqueta : "Etiqueta null"}</h3>
                                        <p className="sub-text">{etiqueta.lote}</p>
                                    </div>

                                    <div className="iconos-button">
                                        <button className="button-icon" >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 iconos " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button> 
                                
                                        <button className="button-icon" onClick={(e) => {
                                            setEtiquetaDelete({
                                                id: etiqueta.id,
                                                name:etiqueta.nameEtiqueta,
                                                estado:true
                                            })
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6  iconos delete" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                        <input type="radio" id="html" name = "test" value={etiqueta.nameEtiqueta} onChange={(e)=> {SetEtiquetaPrint({id: etiqueta.id, estado: e.target.checked})}}/>
                                    </div>
                                    
                                </div>
                            </article>
                        </motion.div>
                    )
                })}
                </form>
                <Instrucciones/>
            </div>
        </>
    )
}