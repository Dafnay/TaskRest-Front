import { useState } from 'react'
import { register } from '../api/client'
import { Link, useNavigate } from 'react-router-dom'
import registerImg from '../assets/register.avif'

const fields = [
  { key: 'fullname',        label: 'Nombre completo',  type: 'text',     placeholder: 'Ana García' },
  { key: 'username',        label: 'Usuario',           type: 'text',     placeholder: 'anagarcia' },
  { key: 'email',           label: 'Email',             type: 'email',    placeholder: 'ana@email.com' },
  { key: 'password',        label: 'Contraseña',        type: 'password', placeholder: '••••••••' },
  { key: 'confirmPassword', label: 'Repetir contraseña',type: 'password', placeholder: '••••••••' },
]

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', fullname: '', password: '', confirmPassword: '',
  })
  const [touched, setTouched] = useState({})
  const [apiError, setApiError] = useState(null)
  const navigate = useNavigate()

  const getFieldError = (key) => {
    if (!touched[key]) return null
    if (!form[key]) return 'Este campo es obligatorio'
    if (key === 'confirmPassword' && form.password && form[key] !== form.password)
      return 'Las contraseñas no coinciden'
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
    const allTouched = Object.fromEntries(fields.map(f => [f.key, true]))
    setTouched(allTouched)

    const hasEmpty = fields.some(f => !form[f.key])
    if (hasEmpty) return
    if (form.password !== form.confirmPassword) return

    try {
      await register(form.username, form.email, form.fullname, form.password)
      navigate('/login', { state: { success: 'Registro completado. Ya puedes iniciar sesión.' } })
    } catch (err) {
      setApiError(err.message)
    }
  }

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row h-100 g-0">

        {/* Columna izquierda: formulario */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-white">
          <div className="w-100 px-4 px-md-5 text-start" style={{ maxWidth: '460px' }}>
            <h2 className="mb-4 fw-bold">Crear cuenta</h2>

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

              {apiError && <div className="alert alert-danger py-2">{apiError}</div>}

              <button type="submit" className="btn btn-success w-100 mt-1">
                Registrarse
              </button>
              <p className="text-center mt-3 mb-0 text-muted">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-decoration-none">Inicia sesión</Link>
              </p>
            </form>
          </div>
        </div>

        {/* Columna derecha: imagen */}
        <div className="col-12 col-md-6 d-none d-md-block">
          <img
            src={registerImg}
            alt="Imagen de un ordenador y una persona trabajando"
            className="w-100 h-100 object-fit-cover"
          />
        </div>

      </div>
    </div>
  )
}
