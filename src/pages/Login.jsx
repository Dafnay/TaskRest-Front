import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import loginImg from '../assets/login.avif'

const fields = [
  { key: 'username', label: 'Usuario',    type: 'text',     placeholder: 'anagarcia' },
  { key: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••' },
]

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [touched, setTouched] = useState({})
  const [apiError, setApiError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()

  const getFieldError = (key) => {
    if (!touched[key]) return null
    if (!form[key]) return 'Este campo es obligatorio'
    return null
  }

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleBlur = (key) => {
    setTouched(prev => ({ ...prev, [key]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ username: true, password: true })
    if (!form.username || !form.password) return
    try {
      const user = await login(form.username, form.password)
      navigate(user.role === 'ADMIN' ? '/users' : '/tasks')
    } catch (err) {
      setApiError(err.message)
    }
  }

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row h-100 g-0">

        {/* Columna izquierda: imagen */}
        <div className="col-12 col-md-6 d-none d-md-block">
          <img
            src={loginImg}
            alt="Imagen de un cuaderno con unas gafas encima y un cafe"
            className="w-100 h-100 object-fit-cover"
          />
        </div>

        {/* Columna derecha: formulario */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-white">
          <div className="w-100 px-4 px-md-5 text-start" style={{ maxWidth: '420px' }}>
            <h2 className="mb-4 fw-bold">Iniciar sesión</h2>

            {state?.success && (
              <div className="alert alert-success py-2 mb-4">{state.success}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {fields.map(({ key, label, type, placeholder }) => {
                const fieldError = getFieldError(key)
                return (
                  <div className="mb-3" key={key}>
                    <label className="form-label fw-medium">
                      {label} <span className="text-danger">*</span>
                    </label>
                    <input
                      className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                      type={type}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => handleChange(key, e.target.value)}
                      onBlur={() => handleBlur(key)}
                    />
                    {fieldError && (
                      <div className="invalid-feedback">{fieldError}</div>
                    )}
                  </div>
                )
              })}

              {apiError && <div className="alert alert-danger py-2 mb-3">{apiError}</div>}

              <button type="submit" className="btn btn-outline-purple w-100 mt-2">
                Entrar
              </button>

              <p className="text-center mt-3 mb-0 text-muted">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-decoration-none">Regístrate</Link>
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
