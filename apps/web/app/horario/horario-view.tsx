'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FadeInUp, StaggerContainer } from '@/components/motion';

const scheduleData = [
  { time: '7:00 - 9:00', lunes: 'Cálculo', martes: 'Física', miercoles: 'Cálculo', jueves: 'Física', viernes: 'Lab' },
  { time: '9:00 - 11:00', lunes: 'Programación', martes: 'Álgebra', miercoles: 'Programación', jueves: 'Álgebra', viernes: 'Taller' },
  { time: '11:00 - 13:00', lunes: 'Inglés', martes: 'Química', miercoles: 'Inglés', jueves: 'Química', viernes: 'Lab' },
];

export function HorarioView() {
  return (
    <div className="space-y-6">
      <FadeInUp>
        <h1 className="text-2xl font-display font-semibold gradient-text">Horario de Clases</h1>
      </FadeInUp>
      
      <StaggerContainer staggerDelay={0.1}>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Semana Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-3 text-left font-medium text-muted-foreground">Hora</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Lunes</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Martes</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Miércoles</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Jueves</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Viernes</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((row, i) => (
                    <motion.tr 
                      key={i}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      whileHover={{ scale: 1.01 }}
                    >
                      <td className="p-3 font-medium text-muted-foreground">{row.time}</td>
                      <td className="p-3">{row.lunes}</td>
                      <td className="p-3">{row.martes}</td>
                      <td className="p-3">{row.miercoles}</td>
                      <td className="p-3">{row.jueves}</td>
                      <td className="p-3">{row.viernes}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </StaggerContainer>
    </div>
  );
}
