# 📊 Diagramas UML - PyroShop

Este documento contiene los diagramas UML del proyecto en **formato PlantUML**, listos para ser usados, modificados o renderizados por cualquier herramienta o IA.

---

## 📁 Archivos Incluidos

### 1. **Diagrama_Clases.puml**
**Propósito:** Muestra la estructura de clases, componentes React, modelos de datos y servicios.

**Contiene:**
- 📊 **Modelos Firestore** (Usuario, Producto, Pedido, Carrito, etc.)
- ⚛️ **Componentes React** (LoginPage, DashboardPage, Inventario, Admin, etc.)
- 🔧 **Servicios** (auditoriaService, backupService, responsiveImageHelper, retryHelper)
- ☁️ **Cloud Functions** (cleanupAuditoria, backupAdminConfig, updateRateLimitCounter, etc.)

**Relaciones clave:**
- Usuario → Pedido → LineaPedido → Producto
- Carrito → LineaCarrito → Producto
- MainLayout → (Navbar + Footer + Contenido)
- Components reutilizables (ProtectedRoute, Spinner, NotFoundPage)

**Uso:** Entender la arquitectura de clases, dependencias y modelos de datos.

---

### 2. **Diagrama_CasosUso.puml**
**Propósito:** Muestra los flujos de interacción de usuarios con el sistema.

**Actores:**
- 👤 **Cliente** - Usuario que compra productos
- ⚙️ **Admin/Vendedor** - Gestiona el sistema
- 🔄 **Sistema** - Procesos automáticos
- 💾 **Firestore, Cloud Functions, Cloudinary** - Servicios externos

**Grupos de Casos de Uso:**

#### 🛍️ Cliente (16 casos de uso)
1. Registrarse → Iniciar Sesión → Ver Catálogo
2. Agregar al Carrito → Gestionar Carrito → Checkout
3. Confirmar Pedido → Ver Pedidos → Rastrear
4. Ver Promociones → Registrarse en Eventos
5. Contactar Soporte → Cerrar Sesión

#### ⚙️ Administrador (10+ casos de uso)
- A1. Dashboard Administrativo
- A2. Gestionar Productos (Agregar, Editar, Eliminar, Subir Imágenes)
- A3. Gestionar Categorías
- A4. Gestionar Pedidos (cambiar estado)
- A5-A10. Zonas, Ofertas, Eventos, Auditoría, Backups, Usuarios

#### 🔄 Sistema (7 casos de uso)
- Validar Integridad
- Registrar Auditoría
- Control Rate Limiting
- Backup Automático
- Limpiar Datos Obsoletos
- Enviar Notificaciones
- Optimizar Imágenes

---

## 🛠️ Cómo Usar Estos Diagramas

### **Opción 1: Renderizar Online**
1. Ir a [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)
2. Copiar el contenido del archivo `.puml`
3. Pegar en el editor → Ver diagrama renderizado

### **Opción 2: Usar en VS Code**
Instala la extensión **PlantUML** en VS Code:
```
ms-pythonitall.vscode-plantuml
```
Luego, abre el archivo `.puml` y usa `Alt+D` para previsualizar.

### **Opción 3: Generar PNG/SVG/PDF**
Instala PlantUML localmente:
```bash
# Con Homebrew (Mac)
brew install plantuml

# Con apt (Linux)
sudo apt-get install plantuml

# Luego generar:
plantuml Diagrama_Clases.puml -o output_folder
```

### **Opción 4: Compartir con otra IA**
1. Abre el archivo `.puml`
2. Copia todo el contenido
3. Pega en el chat de la IA
4. Pide que:
   - **Explique el diagrama**
   - **Genere documentación a partir del diagrama**
   - **Sugiera mejoras o cambios**
   - **Agregue nuevos componentes/casos de uso**
   - **Traduzca a otro formato (JSON, XML, etc.)**

---

## 📝 Convenciones PlantUML Usadas

### Diagrama de Clases
```
class NombreClase {
  --Atributos--
  atributo: tipo
  --Métodos--
  metodo(): retorno
}

interface InterfazNombre {
  {abstract} metodoAbstracto()
}

Clase1 --> Clase2 : "relación"
Clase1 <|-- Clase2 : "herencia"
Clase1 ..> Clase2 : "dependencia"
```

### Diagrama de Casos de Uso
```
:Actor: as actor
usecase "Caso de Uso" as UC_Nombre

actor -- UC_Nombre : interactúa

UC1 ..> UC2 : <<include>> (siempre ocurre)
UC1 ..> UC2 : <<extend>> (puede ocurrir)
```

### Colores Utilizados
- 🔵 **Azul (#E3F2FD)** - Modelos Firestore / Sistema
- 🟢 **Verde (#C8E6C9)** - Cliente / Casos de Uso Público
- 🟠 **Naranja (#FFE0B2)** - Admin / Casos de Uso Administrativo
- 🟣 **Violeta (#F3E5F5)** - Componentes React / Servicios

---

## 🔄 Flujos Principales Representados

### **Flujo de Compra (Cliente)**
```
Registrarse → Login → Ver Catálogo → Agregar Carrito 
→ Checkout → Confirmar Pedido → Ver Pedidos → Rastrear
```

### **Flujo de Gestión (Admin)**
```
Dashboard → Gestionar Productos → Subir Imágenes (Cloudinary)
→ Gestionar Pedidos → Ver Auditoría → Backups
```

### **Flujos Automáticos (Sistema)**
```
Evento de Escritura → Validar Integridad → Registrar Auditoría
→ Incrementar Rate Limit (Cloud Functions)

Horario Programado → Ejecutar Backup / Limpiar Datos
→ Guardar en Cloud Storage
```

---

## 📌 Notas Importantes

1. **Completitud:** Los diagramas representan la **estructura lógica** del proyecto. No incluyen detalles de styling (CSS) ni librerías menores.

2. **Extensibilidad:** Puedes añadir nuevos componentes/casos de uso siguiendo la sintaxis PlantUML.

3. **Mantenimiento:** Al agregar nuevas funcionalidades, actualiza estos diagramas para mantener sincronía con la realidad del código.

4. **Documentación Automática:** Los diagramas pueden generarse automáticamente desde el código usando herramientas como:
   - Mermaid CLI
   - PlantUML Maven Plugin
   - Scripts Node.js personalizados

---

## 🤖 Para Compartir con Otra IA

Usa este template:

```
Tengo dos diagramas UML en PlantUML para un proyecto React + Firebase llamado PyroShop:

1. Diagrama_Clases.puml - Define 40+ clases/componentes y sus relaciones
2. Diagrama_CasosUso.puml - Define 30+ casos de uso y flujos de actor

Te comparto el contenido a continuación. Por favor:
- [ ] Explica la arquitectura general
- [ ] Identifica patrones de diseño
- [ ] Sugiere mejoras o componentes faltantes
- [ ] Genera documentación HTML/Markdown a partir de esto
- [ ] Crea ejemplos de código basados en estos diagramas

[PEGA EL CONTENIDO .puml AQUÍ]
```

---

## 📚 Referencias

- **PlantUML Documentation:** http://plantuml.com/
- **PlantUML Class Diagram:** http://plantuml.com/class-diagram
- **PlantUML Use Case Diagram:** http://plantuml.com/use-case-diagram
- **React Patterns:** https://react.dev/
- **Firebase Patterns:** https://firebase.google.com/docs/

---

**Última actualización:** 11 de diciembre de 2025
**Proyecto:** PyroShop - Tienda Virtual de Pirotecnia
**Versión:** 1.0

