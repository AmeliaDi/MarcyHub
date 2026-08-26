'use client';

import * as React from 'react';
import { useAppStore } from '@/stores/app-store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatRelativeDate, getSubjectColor } from '@/lib/utils';
import { CheckCircle2, Circle, BookOpen, Calendar, TrendingUp, Clock } from 'lucide-react';
import type { Task } from '@/types';

export function DashboardView() {
  const { tasks, resources, toggleTask } = useAppStore();

  // Calcular estadísticas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Próximas tareas (no completadas, ordenadas por fecha)
  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
    .slice(0, 5);

  // Recursos por materia
  const resourcesBySubject = resources.reduce((acc, resource) => {
    acc[resource.subjectClave] = (acc[resource.subjectClave] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statCards = [
    {
      title: 'Tareas Pendientes',
      value: pendingTasks.toString(),
      description: `${completedTasks} completadas`,
      icon: Circle,
      color: 'text-warning bg-warning/10'
    },
    {
      title: 'Progreso Total',
      value: `${completionRate}%`,
      description: 'Tasa de completado',
      icon: TrendingUp,
      color: 'text-success bg-success/10'
    },
    {
      title: 'Recursos',
      value: resources.length.toString(),
      description: 'Materias: ' + Object.keys(resourcesBySubject).length,
      icon: BookOpen,
      color: 'text-info bg-info/10'
    },
    {
      title: 'Próxima Entrega',
      value: upcomingTasks.length > 0 ? formatRelativeDate(upcomingTasks[0].due) : '—',
      description: upcomingTasks.length > 0 ? upcomingTasks[0].title : 'Sin tareas pendientes',
      icon: Clock,
      color: 'text-accent bg-accent/10'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold truncate">{stat.value}</p>
                  <p className="text-xs text-muted-foreground truncate">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Próximas Tareas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Próximas Entregas
            </CardTitle>
            <CardDescription>
              Tus tareas más urgentes ordenadas por fecha de entrega
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>¡No tienes tareas pendientes!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors duration-150 group"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex-shrink-0 text-muted-foreground hover:text-success transition-colors duration-150"
                    >
                      <Circle className="h-5 w-5" />
                    </button>
                    
                    <div 
                      className="w-1 h-10 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getSubjectColor(task.subjectClave) }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{task.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">{task.desc}</p>
                    </div>
                    
                    <div className="flex-shrink-0 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        new Date(task.due) < new Date() 
                          ? 'bg-destructive/10 text-destructive' 
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {formatRelativeDate(task.due)}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Materia: {task.subjectClave}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recursos por Materia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              Recursos por Materia
            </CardTitle>
            <CardDescription>
              Distribución de materiales disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(resourcesBySubject).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No hay recursos disponibles</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(resourcesBySubject).map(([clave, count]) => (
                  <div key={clave} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Materia {clave}</span>
                      <span className="text-muted-foreground">{count} recursos</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, (count / Math.max(...Object.values(resourcesBySubject))) * 100)}%`,
                          backgroundColor: getSubjectColor(clave)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accesos Rápidos */}
        <Card>
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
            <CardDescription>Navegación directa a las secciones principales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3">
              <Calendar className="h-4 w-4" />
              Ver Horario Completo
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <CheckCircle2 className="h-4 w-4" />
              Gestionar Tareas
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <BookOpen className="h-4 w-4" />
              Explorar Recursos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
