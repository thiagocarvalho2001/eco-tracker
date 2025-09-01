import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Recycle, Leaf, Users, BarChart3 } from 'lucide-react'
import UserRegistration from './components/UserRegistration.jsx'
import DiscardRegistration from './components/DiscardRegistration.jsx'
import UserDashboard from './components/UserDashboard.jsx'
import MapView from './components/MapView.jsx'
import Analytics from './components/Analytics.jsx'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUserCreated = (userId) => {
    setCurrentUser(userId)
  }

  const handleDiscardRegistered = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setRefreshKey(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-600 rounded-full">
              <Recycle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">EcoTracker</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Registre seus descartes responsáveis, ganhe pontos e contribua para um mundo mais sustentável
          </p>
        </div>

        {!currentUser ? (
          /* Welcome Screen */
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardHeader>
                  <Leaf className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <CardTitle>Sustentabilidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Incentive práticas sustentáveis na sua comunidade
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle>Dados Reais</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Gere dados sobre descarte de resíduos na sua região
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle>Comunidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Análises úteis para escolas, ONGs e órgãos públicos
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
            
            <UserRegistration onUserCreated={handleUserCreated} />
          </div>
        ) : (
          /* Main App */
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Bem-vindo ao EcoTracker!</h2>
              <Button variant="outline" onClick={handleLogout}>
                Trocar Usuário
              </Button>
            </div>
            
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="register">Registrar Descarte</TabsTrigger>
                <TabsTrigger value="map">Pontos de Coleta</TabsTrigger>
                <TabsTrigger value="analytics">Análises</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard">
                <UserDashboard key={refreshKey} userId={currentUser} />
              </TabsContent>
              
              <TabsContent value="register">
                <DiscardRegistration 
                  userId={currentUser} 
                  onDiscardRegistered={handleDiscardRegistered}
                />
              </TabsContent>
              
              <TabsContent value="map">
                <MapView />
              </TabsContent>
              
              <TabsContent value="analytics">
                <Analytics />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
