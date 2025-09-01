import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { MapPin, Navigation, Recycle } from 'lucide-react'

export default function MapView() {
  const [userLocation, setUserLocation] = useState(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  // Pontos de coleta fictícios para demonstração
  const collectionPoints = [
    {
      id: 1,
      name: "Posto de Coleta Vila Madalena",
      address: "Rua Harmonia, 123 - Vila Madalena",
      materials: ["plástico", "vidro", "papel", "metal"],
      lat: -23.5505,
      lng: -46.6833
    },
    {
      id: 2,
      name: "Ecoponto Pinheiros",
      address: "Av. Faria Lima, 456 - Pinheiros",
      materials: ["eletrônico", "plástico", "papel"],
      lat: -23.5489,
      lng: -46.6388
    },
    {
      id: 3,
      name: "Centro de Reciclagem Itaim",
      address: "Rua Joaquim Floriano, 789 - Itaim Bibi",
      materials: ["plástico", "vidro", "metal", "orgânico"],
      lat: -23.5505,
      lng: -46.6794
    }
  ]

  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setIsLoadingLocation(false)
        },
        (error) => {
          console.error('Erro ao obter localização:', error)
          setIsLoadingLocation(false)
          alert('Não foi possível obter sua localização. Verifique as permissões do navegador.')
        }
      )
    } else {
      alert('Geolocalização não é suportada neste navegador.')
      setIsLoadingLocation(false)
    }
  }

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371 // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const sortedPoints = userLocation 
    ? collectionPoints
        .map(point => ({
          ...point,
          distance: calculateDistance(userLocation.lat, userLocation.lng, point.lat, point.lng)
        }))
        .sort((a, b) => a.distance - b.distance)
    : collectionPoints

  return (
    <div className="space-y-6">
      {/* Location Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Sua Localização
          </CardTitle>
          <CardDescription>
            Encontre pontos de coleta próximos a você
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              onClick={getCurrentLocation} 
              disabled={isLoadingLocation}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              {isLoadingLocation ? 'Obtendo localização...' : 'Obter Minha Localização'}
            </Button>
            {userLocation && (
              <div className="text-sm text-muted-foreground">
                Localização obtida: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Collection Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Recycle className="h-5 w-5 text-green-600" />
            Pontos de Coleta
          </CardTitle>
          <CardDescription>
            {userLocation ? 'Ordenados por proximidade' : 'Pontos de coleta disponíveis'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedPoints.map((point) => (
              <div key={point.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{point.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {point.address}
                    </p>
                  </div>
                  {point.distance && (
                    <div className="text-sm font-medium text-green-600">
                      {point.distance.toFixed(1)} km
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {point.materials.map((material) => (
                    <span 
                      key={material}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {material}
                    </span>
                  ))}
                </div>
                
                <div className="mt-3 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const url = `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`
                      window.open(url, '_blank')
                    }}
                  >
                    Ver no Mapa
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (userLocation) {
                        const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${point.lat},${point.lng}`
                        window.open(url, '_blank')
                      } else {
                        alert('Obtenha sua localização primeiro para ver as direções.')
                      }
                    }}
                  >
                    Como Chegar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map Integration Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Integração com Mapas</h4>
              <p className="text-sm text-blue-700 mt-1">
                Esta versão demonstra a funcionalidade básica de localização. 
                Em uma implementação completa, seria integrada com a API do Google Maps 
                para exibir um mapa interativo com os pontos de coleta.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

