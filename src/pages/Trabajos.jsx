import { Link, NavLink } from 'react-router-dom'
import { useContext, useEffect, useState, } from 'react'
import DeleteModal from '../components/microcomponents/DeletModal'
import smile from '../assets/smile.png'
import imgDefault from '../assets/imgDefault.jpg'
import Toastify from 'toastify-js'
import '../style/Trabajos.css'
import { UserContext } from '../context/UserContextB'


export function Trabajos() {
    const [showModal, setShowModal] = useState(false)
    const [imgs, setImgs] = useState([])
    const { userData, setUserData } = useContext(UserContext)

    useEffect(() => {
        try {
            fetch('https://melvera-api-c6l8.onrender.com/api/works')
                .then(res => res.json())
                .then(data => setImgs(data.getWorks))
        } catch (error) {
            console.log(error)
        }
    }, [])
    const handleDeleteWork = () => {
        console.log('trabajo eliminado');
        setShowModal(false)
        Toastify({
            text: "Trabajo eliminado de forma exitosa",
            duration: 2000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, red, orange)",
            },
            onClick: function () { } // Callback after click
        }).showToast();
    }
    // useEffect(() => {
    //     console.log(showModal);
    // }, [])
    return (
        <>
            <section className="trabajos">
                {
                    userData && <div className='flex justify-end userControls '>
                        <NavLink to={'/crear-trabajo'} className={'flex justify-end'} ><span>Nuevo trabajo</span> ➕</NavLink>
                    </div>
                }
                <div className="gridContainer">
                    <ul >
                        {
                            imgs?.map(image => {
                                return (
                                    <li key={image._id}>
                                        <Link>
                                            <img src={image.imageUrl || imgDefault} alt="" />
                                        </Link>
                                        {
                                            userData &&
                                            <button className='eraseBtn z-[100]' onClick={() => setShowModal(true)}>
                                                <img src={smile} alt="botón bote de basura para eliminar el item" />
                                            </button>

                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                {showModal && (
                    <DeleteModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        onDelete={handleDeleteWork}
                    />
                )}
            </section>
        </>
    )
}