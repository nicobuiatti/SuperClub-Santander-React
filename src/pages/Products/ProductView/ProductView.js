import './ProductView.css'
import { useState, useRef , useEffect} from 'react'
import { useParams } from 'react-router-dom'
import MuestraPageProduct from '../../../components/MuestraPageProduct/MuestraPageProduct'
import Header from "../../../components/Header/Header"
import axiosActual from '../../../utils'
import Button from '../../../components/Button/Button'


const ProductView = ({storesName}) => {
  const [currentProduct, setCurrentProduct] = useState({})
  const [mensajeError, setMensajeError] = useState("")
  const [product, setProduct] = useState({})
  const insertImgInput = useRef()
  const {id} = useParams()

  const handleSelectStore = (e) => {
    setCurrentProduct((prev) => {
      const copy = { ...prev }
      copy.store = e.target.value
      return copy
    })
  }

  const handleTitle = (e) => {
    const currentValue = e.target.value
    
      setCurrentProduct((prev) => {
        const copy = { ...prev }
        copy.title = currentValue
        return copy
      })

      if (!currentValue) setMensajeError("Debe ingresar un producto")
      else setMensajeError("")
  }

  const handlePrice = (e) => {
    setCurrentProduct((prev) => {
      const copy = { ...prev }
      copy.price = e.target.value || 0
      return copy
    })
  }

  const handleDescription = (e) => {
    setCurrentProduct((prev) => {
      const copy = { ...prev }
      copy.description = e.target.value
      return copy
    })
  }

  const handleChangeStock = (e) => {
    setCurrentProduct((prev) => {
        const copy = { ...prev }
        copy.stock = e.target.value
        return copy
      })
  }

  const handleRemoveImg = (img) => {
    console.log(img)
    setCurrentProduct((prev) => {
      const copy = { ...prev }
      copy.gallery = copy.gallery.filter((element) => element !== img)
      return copy
    })
  }

  const handleClickSum = () => {
    setCurrentProduct((prev) => {
      const copy = { ...prev }
      copy.stock += 1
      return copy
    })
  }

  const handleClickRest = () => {
    if (currentProduct.stock > 0)
      setCurrentProduct((prev) => {
        const copy = { ...prev }
        copy.stock -= 1
        return copy
      })
  }

  const handleInsertImg = (e) => {
    const currentValue = insertImgInput.current.value

    if (
      e.key === 'Enter' &&
      currentValue &&
      !currentProduct.gallery.find((element) => element === currentValue)
    ) {
      setCurrentProduct((prev) => {
        const copy = { ...prev }
        copy.gallery.push(currentValue)
        console.log(copy)
        return copy
      })
    }
  }

  const handleSaveData = () => {
    axiosActual.put(
      `products/${currentProduct._id}/edit`,
      currentProduct
    )
  }

  const handleCancel = () => {
    setCurrentProduct(product)
  }

  const handleDelete = () => {
    axiosActual.delete(
      `products/${currentProduct._id}/delete`
    )
  }

  useEffect(() => {
    axiosActual.get(
        `products/${id}`
    ).then(({data}) =>{ 
        setCurrentProduct(data)
        setProduct(data)}) 
  }, [id])

  return (
    <div className=" containerProduct">
      <Header>
        <div className = "containerIdDelete">
            <p className="productId"> Productos {">"} #{currentProduct._id}</p>
            <Button onClick={handleDelete}>Eliminar</Button>
        </div>
      </Header>
      <main className=" mainAreaContent">
        <div className=" productViewContainer">
          <div className="formPageProduct">
            <MuestraPageProduct product={currentProduct} />
            <p className="tituloProductPage">Información</p>
            <label className="labelProductPage"  for="name">Nombre</label>
            <input
              onChange={handleTitle}
              className=" inputPageProduct"
              type="text"
              name="title"
              id="title"
              value={currentProduct.title}
            />
            {mensajeError && <p>{mensajeError}</p>}

            <label className="labelProductPage" for="valor">Valor</label>
            <input
              min="0"
              onChange={handlePrice}
              className=" inputPageProduct"
              type="number"
              name="price"
              id="price"
              value={currentProduct.price}
            />

            <label className="labelProductPage" for="stock">Stock</label>

            <div className="containerInputPageProductStock">
              <button onClick={handleClickRest} className="buttonPageProduct">
                -
              </button>
              <input
                className="inputPageProductStock"
                type="text"
                name="stock"
                placeholder="0"
                value={currentProduct.stock}
                onChange={handleChangeStock}
              />
              <button onClick={handleClickSum} className="buttonPageProduct">
                +
              </button>
            </div>

            <label className="labelProductPage" for="description">Descripción</label>
            <textarea
              onChange={handleDescription}
              className="inputPageProductArea"
              name="description"
              value={currentProduct.description}
            />

            <label className="labelProductPage" for="tienda">Tienda</label>
            <select
              value={currentProduct.store || ''}
              onChange={handleSelectStore}
              className="inputPageProduct"
              name="tienda"
            >
              <option value="">Selecciona la tienda</option>
              {storesName?.map(({name, _id}) => (
                <option name={name} value={_id}>{name}</option>
              ))}
            </select>
          </div>

          <p className="tituloProductPage">Galería de Imágenes</p>
          <div className="containerNuevaImagenInput">
            <label className="labelProductPage" for="imagen">Nueva Imagen</label>
            <input
              onKeyDown={handleInsertImg}
              ref={insertImgInput}
              className=" inputPageProduct"
              type="text"
              name="imagen"
            ></input>
          </div>
          <p className="tituloProductPage">Imágenes Actuales</p>

          <div className="cartImgProductPage">
            {currentProduct?.gallery?.map((element) => (
              <div className="cartProductPage">
                <img
                  className="imgCartPage"
                  src={element}
                  alt={currentProduct.title}
                ></img>
                <p className="textCartProductPage">{element}</p>
                <Button onClick={() => handleRemoveImg(element)}>Quitar</Button>
              </div>
            ))}
          </div>
          <div className="buttonsPageProduct">
            <Button
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              disabled={Boolean(mensajeError)}
              onClick={handleSaveData}
            >
              Guardar
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductView
