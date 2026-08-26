'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FadeInUp, StaggerContainer } from '@/components/motion';

const usuariosData = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'Estudiante' },
  { id: 2, nombre: 'María García', email: 'maria@example.com', rol: 'Profesor' },
  { id: 3, nombre: 'Carlos López', email: 'carlos@example.com', rol: 'Admin' },
];

export function AdminView() {
  return (
    <div className="space-y-6">
      <FadeInUp>
        <h1 className="text-2xl font-display font-semibold gradient-text">Panel de Administración</h1>
      </FadeInUp>
      
      <StaggerContainer staggerDelay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {usuariosData.map((usuario) => (
                <motion.div
                  key={usuario.id}
                  className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{usuario.nombre}</p>
                      <p className="text-sm text-muted-foreground">{usuario.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {usuario.rol}
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
