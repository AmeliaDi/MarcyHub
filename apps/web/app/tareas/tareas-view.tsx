'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FadeInUp, StaggerContainer } from '@/components/motion';

const tareasData = [
  { id: 1, materia: 'Cálculo', descripcion: 'Ejercicios capítulo 5', fecha: '2024-02-01', completada: false },
  { id: 2, materia: 'Física', descripcion: 'Lab de movimiento', fecha: '2024-02-03', completada: true },
  { id: 3, materia: 'Programación', descripcion: 'Proyecto final', fecha: '2024-02-10', completada: false },
];

export function TareasView() {
  return (
    <div className="space-y-6">
      <FadeInUp>
        <h1 className="text-2xl font-display font-semibold gradient-text">Tareas</h1>
      </FadeInUp>
      
      <StaggerContainer staggerDelay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>Mis Tareas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tareasData.map((tarea) => (
                <motion.div
                  key={tarea.id}
                  className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{tarea.descripcion}</p>
                      <p className="text-sm text-muted-foreground">{tarea.materia}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${tarea.completada ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                      {tarea.fecha}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </StaggerContainer>
    </div>
  );
}
