'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FadeInUp, StaggerContainer } from '@/components/motion';

const recursosData = [
  { id: 1, nombre: 'Guía de Cálculo', tipo: 'PDF', url: '#' },
  { id: 2, nombre: 'Video: Leyes de Newton', tipo: 'Video', url: '#' },
  { id: 3, nombre: 'Código ejemplo React', tipo: 'Código', url: '#' },
];

export function RecursosView() {
  return (
    <div className="space-y-6">
      <FadeInUp>
        <h1 className="text-2xl font-display font-semibold gradient-text">Recursos</h1>
      </FadeInUp>
      
      <StaggerContainer staggerDelay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>Material de Estudio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recursosData.map((recurso) => (
                <motion.div
                  key={recurso.id}
                  className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{recurso.nombre}</p>
                      <p className="text-sm text-muted-foreground">{recurso.tipo}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Ver recurso
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
