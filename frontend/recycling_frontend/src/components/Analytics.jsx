import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, Users, Award, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react'

export default function Analytics() {
  const [communityData, setCommunityData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCommunityData()
  }, [])

  const fetchCommunityData = async () => {
    try {
      const response = await fetch('http://localhost:5000/community_discards')
      if (response.ok) {
        const data = await response.json()
        setCommunityData(data)
      }
    } catch (error) {
      console.error('Erro ao buscar dados da comunidade:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center">Carregando análises...</div>
  }

  // Processar dados para gráficos
  const materialCounts = communityData.reduce((acc, discard) => {
    acc[discard.material_type] = (acc[discard.material_type] || 0) + 1
    return acc
  }, {})

  const materialData = Object.entries(materialCounts).map(([material, count]) => ({
    material: material.charAt(0).toUpperCase() + material.slice(1),
    count,
    percentage: ((count / communityData.length) * 100).toFixed(1)
  }))

  // Dados por mês (simulado para demonstração)
  const monthlyData = [
    { month: 'Jan', discards: 45 },
    { month: 'Fev', discards: 52 },
    { month: 'Mar', discards: 48 },
    { month: 'Abr', discards: 61 },
    { month: 'Mai', discards: 55 },
    { month: 'Jun', discards: 67 }
  ]

  // Cores para o gráfico de pizza
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16']

  // Ranking de usuários (simulado)
  const userRanking = [
    { name: 'Maria Silva', points: 120, discards: 12 },
    { name: 'João Santos', points: 95, discards: 9 },
    { name: 'Ana Costa', points: 80, discards: 8 },
    { name: 'Pedro Lima', points: 75, discards: 7 },
    { name: 'Carla Souza', points: 60, discards: 6 }
  ]

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Descartes</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{communityData.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(communityData.map(d => d.user_id)).size}</div>
            <p className="text-xs text-muted-foreground">
              Participando da comunidade
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Material Mais Descartado</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {materialData.length > 0 ? materialData.sort((a, b) => b.count - a.count)[0].material : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {materialData.length > 0 ? `${materialData.sort((a, b) => b.count - a.count)[0].percentage}% do total` : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras - Materiais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Descartes por Tipo de Material
          </CardTitle>
          <CardDescription>
            Distribuição dos materiais descartados pela comunidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={materialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="material" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza e Linha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Proporção de Materiais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={materialData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ material, percentage }) => `${material}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {materialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Evolução Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="discards" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ranking de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ranking da Comunidade
          </CardTitle>
          <CardDescription>
            Usuários mais engajados na reciclagem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userRanking.map((user, index) => (
              <div key={user.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.discards} descartes</p>
                  </div>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {user.points} pontos
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">Insights da Comunidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-green-800">
            <p>• O plástico representa a maior parte dos descartes, indicando uma oportunidade para campanhas de redução.</p>
            <p>• A comunidade está crescendo 12% ao mês, mostrando maior consciência ambiental.</p>
            <p>• Os usuários mais ativos podem ser embaixadores para engajar novos participantes.</p>
            <p>• Considere parcerias com pontos de coleta para materiais menos descartados.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

