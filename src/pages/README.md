# 📘 Construcción de una Vista Completa con CRUD en React + Firebase

## 🎯 Objetivo
El objetivo de esta actividad es que cada estudiante pueda desarrollar una **vista completa (page)** en la aplicación, integrando los conceptos aprendidos durante el curso: **autenticación, componentes reutilizables, Firestore, y despliegue en Firebase Hosting**.  

Se busca que el estudiante tenga la experiencia de **crear un módulo funcional de sistema de información**, aplicando operaciones CRUD (**Crear, Leer, Actualizar y Eliminar**) sobre Firestore.  

---

## 🏗️ Estructura del Proyecto
El proyecto ya cuenta con las siguientes páginas básicas:
- `LoginPage`
- `RegisterPage`
- `ResetPasswordPage`
- `ForgotPasswordPage`
- `DashboardPage`

### Componentes reutilizables
Dentro de la carpeta `components/` deben estar:
- `NavbarDashboard.jsx`  
- `FooterDashboard.jsx`

Estos componentes se reutilizan en las diferentes vistas para mantener una **estructura organizada y profesional**.  

La idea es que la **vista principal** de cada módulo (ejemplo: servicios, clientes, productos, inventario) quede **“en el medio”** entre el Navbar y el Footer.  

---

## 📋 Actividad a desarrollar
Cada estudiante deberá:
1. **Crear una nueva página (vista)**, con el nombre de su preferencia:  
   - Ejemplos: `ServiciosPage`, `ClientesPage`, `ProductosPage`, `InventarioPage`.  

2. **Diseñar un formulario en la parte superior de la vista** para registrar información en Firestore.  
   - Los campos son libres, dependiendo de la entidad elegida.  
   - Ejemplo (para `Productos`): nombre, categoría, valor, cantidad, activo (booleano).  

3. **Mostrar la información registrada en una tabla** en la parte inferior de la misma vista.  

4. Implementar las operaciones **CRUD**:  
   - **Crear:** Guardar en Firestore desde el formulario.  
   - **Leer:** Mostrar todos los registros en la tabla.  
   - **Actualizar:** Permitir editar un registro (puede hacerse en modal o inline).  
   - **Eliminar:** Permitir borrar un registro (con confirmación).  

5. **Organizar la vista** de forma que:  
   - Navbar arriba  
   - Vista central (el módulo con formulario + tabla)  
   - Footer abajo  

---

## 📌 Recomendaciones
- Usar **Bootstrap** para mantener el estilo limpio y organizado.  
- Reutilizar los componentes ya creados (Navbar y Footer).  
- Validar que los datos se guarden correctamente en Firestore.  
- Opcional: usar **SweetAlert2** para confirmaciones y alertas amigables.  

---

## 📤 Entregable
- Una nueva **vista completa y funcional** desplegada en el **Firebase Hosting** ya configurado.  
- Debe ser accesible desde el `DashboardPage` o desde el menú de navegación.  
- Código organizado en carpetas:  
  ```
  src/
  ├── components/
  │   ├── NavbarDashboard.jsx
  │   └── FooterDashboard.jsx
  ├── pages/
  │   ├── DashboardPage.jsx
  │   ├── [NuevaVistaPage].jsx   <-- Aquí va la vista desarrollada
  └── ...
  ```

---

## ✅ Criterios de evaluación
1. Correcta separación por componentes (Navbar, Footer, Vista).  
2. Integración de Firestore con operaciones CRUD.  
3. Uso de diseño limpio y ordenado con Bootstrap.  
4. Navegación funcional entre Dashboard y la nueva vista.  
5. Despliegue exitoso en Firebase Hosting.  

---

## 🚀 Resultado esperado
Al final de la actividad, cada estudiante tendrá un **módulo propio de sistema de información**, donde podrá:  
- Registrar información desde un formulario.  
- Visualizar los datos en tiempo real desde Firestore.  
- Editar y eliminar registros.  
- Mantener la estructura de Dashboard con Navbar y Footer.  

Esto dará la experiencia de haber creado una **mini aplicación real en la nube**.  
