import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { User, Trophy, Calendar, MapPin, Recycle } from 'lucide-react'

export default function UserDashboard({ userId }) {
  const [user, setUser] = useState(null)
  const [discards, setDiscards] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
    fetchUserDiscards()
  }, [userId])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`)
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
    }
  }

  const fetchUserDiscards = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/discards`)
      if (response.ok) {
        const discardsData = await response.json()
        setDiscards(discardsData)
      }
    } catch (error) {
      console.error('Erro ao buscar descartes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = () => {
    fetchUserData()
    fetchUserDiscards()
  }

  if (isLoading) {
    return <div className="text-center">Carregando...</div>
  }

  if (!user) {
    return <div className="text-center">Usuário não encontrado</div>
  }

  const materialCounts = discards.reduce((acc, discard) => {
    acc[discard.material_type] = (acc[discard.material_type] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil do Usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">
                {user.age ? `${user.age} anos` : 'Idade não informada'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {user.neighborhood && user.city 
                  ? `${user.neighborhood}, ${user.city}`
                  : user.city || 'Localização não informada'
                }
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold text-lg">{user.points} pontos</span>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Recycle className="h-5 w-5 text-green-600" />
            Estatísticas de Reciclagem
          </CardTitle>
          <CardDescription>
            Total de {discards.length} descarte(s) registrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(materialCounts).map(([material, count]) => (
              <Badge key={material} variant="secondary" className="justify-center">
                {material}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Discards */}
      <Card>
        <CardHeader>
          <CardTitle>Descartes Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {discards.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhum descarte registrado ainda
            </p>
          ) : (
            <div className="space-y-3">
              {discards.slice(-5).reverse().map((discard) => (
                <div key={discard.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold capitalize">{discard.material_type}</p>
                      {discard.quantity && (
                        <p className="text-sm text-muted-foreground">{discard.quantity}</p>
                      )}
                      {discard.location_manual && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {discard.location_manual}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(discard.timestamp).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

