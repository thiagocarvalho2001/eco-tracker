import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Recycle, MapPin } from 'lucide-react'

export default function DiscardRegistration({ userId, onDiscardRegistered }) {
  const [formData, setFormData] = useState({
    material_type: '',
    quantity: '',
    location_manual: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const materialTypes = [
    'plástico',
    'vidro',
    'papel',
    'metal',
    'eletrônico',
    'orgânico',
    'outros'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch(import.meta.env.VITE_API_URL +  '/discards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          material_type: formData.material_type,
          quantity: formData.quantity,
          location_manual: formData.location_manual
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        onDiscardRegistered()
        setFormData({ material_type: '', quantity: '', location_manual: '' })
        alert('Descarte registrado com sucesso! +10 pontos!')
      } else {
        alert('Erro ao registrar descarte')
      }
    } catch (error) {
      alert('Erro de conexão')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      material_type: value
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
          <Recycle className="h-6 w-6 text-green-600" />
          Registrar Descarte
        </CardTitle>
        <CardDescription className="text-center">
          Registre seu descarte responsável e ganhe pontos!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="material_type">Tipo de Material *</Label>
            <Select onValueChange={handleSelectChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de material" />
              </SelectTrigger>
              <SelectContent>
                {materialTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              name="quantity"
              type="text"
              placeholder="Ex: 2 garrafas, 1kg, 3 latas"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location_manual" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Local do Descarte
            </Label>
            <Input
              id="location_manual"
              name="location_manual"
              type="text"
              placeholder="Ex: Praça da Sé, Posto de coleta do bairro"
              value={formData.location_manual}
              onChange={handleChange}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrar Descarte'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

