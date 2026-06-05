import { useState } from 'react'

const useForm = (initialValues, validate) => {
  const [values, setValues]   = useState(initialValues)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Single field change
  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    // Error clear karo jab user type kare
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Direct value set (select, date, etc.)
  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  // Form validate karo
  const validateForm = () => {
    if (!validate) return true
    const newErrors = validate(values)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Form submit
  const handleSubmit = async (submitFn) => {
    if (!validateForm()) return

    try {
      setLoading(true)
      setSuccess(false)
      await submitFn(values)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setErrors({
        api: err.response?.data?.message || 'Something went wrong'
      })
    } finally {
      setLoading(false)
    }
  }

  // Form reset
  const resetForm = () => {
    setValues(initialValues)
    setErrors({})
    setSuccess(false)
    setLoading(false)
  }

  return {
    values,
    errors,
    loading,
    success,
    handleChange,
    setValue,
    handleSubmit,
    resetForm,
  }
}

export default useForm