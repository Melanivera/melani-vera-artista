import axios from "axios"
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContextB.jsx";
import { urlExpos } from "../utils/urlStore.js";
import Toastify from 'toastify-js'
import { useNavigate } from "react-router-dom";
import { deleteFile, getStorageRefFromUrl } from "../components/firebase/config.js";

export function useExpoHandler() {
    const navigate = useNavigate()
    const { token, getToken } = useContext(UserContext)

    useEffect(() => {
        getToken()
    }, [])


    const postNewExpo = async (newExpo) => {

        if (!token) return navigate('/', { replace: true })

        try {
            const createExpo = await axios.post(urlExpos, newExpo, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            Toastify({
                text: `Creado con éxito`,
                duration: 2000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function () { }, // Callback after click
            }).showToast();
            const timeOut = setTimeout(() => {
                clearTimeout(timeOut)
                navigate('/exposiciones')
            }, 2000)
        } catch (error) {
            deleteImgFirebase(newExpo.image)
            Toastify({
                text: error,
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(to right, #fc0202, #ffa303)"
                },
                onClick: function () { } // Callback after click
            }).showToast();
        }
    }

    const deleteImgFirebase = async (imgUrl) => {
        try {
            //ref search for the img on firebase storage
            const imageRefToDelete = await getStorageRefFromUrl(imgUrl)
            try {
                const imagedeletionResult = await deleteFile(imageRefToDelete)
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteExpo = async (imgUrl, ExpoId) => {
        if (!token) {
            console.log("no hay token");
            return navigate('/', { replace: true })
        }
        try {
            deleteImgFirebase(imgUrl)
        } catch (error) {
            console.log(error)
        }

        try {
            const deletedExpo = await axios.delete(`${urlExpos}/${ExpoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return "deleted"
        } catch (error) {
            console.log(error);
        }

    }
    return { postNewExpo, token, deleteExpo }
}