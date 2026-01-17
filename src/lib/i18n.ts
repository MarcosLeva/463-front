

'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "languages": {
        "en": "English",
        "es": "Spanish"
      },
      "login": {
        "userLabel": "Enter user",
        "passwordLabel": "Enter password",
        "recoverPassword": "Recover password",
        "loginButton": "Login",
        "loggingIn": "Logging in...",
        "footer": "© 2024 AdminView. All rights reserved.",
        "successTitle": "Login successful",
        "successDescription": "Welcome back, {{name}}.",
        "errorTitle": "Login Error",
        "errorDescription": "Please enter your email and password.",
        "errorApi": "Could not connect to the server."
      },
      "header": {
        "searchPlaceholder": "User search",
        "toggleSidebar": "Toggle sidebar",
        "toggleMenu": "Toggle Menu",
        "logout": "LOGOUT",
        "menuDescription": "Main menu for site navigation"
      },
      "sidebar": {
        "users": "USERS",
        "myRooms": "MY ROOMS",
        "createRoom": "CREATE ROOM",
        "editProfile": "EDIT",
        "latestTransactions": "LATEST TRANSACTIONS",
        "createUser": "CREATE A USER",
        "providerStats": "PROVIDER STATISTICS",
        "stats": "STATISTICS",
        "gameSettings": "GAME SETTINGS",
        "changes": "CHANGES",
        "intersectionIp": "INTERSECTION IP",
        "searchPlaceholder": "User search"
      },
      "dashboard": {
        "title": "USERS",
        "configurations": "CONFIGURATIONS",
        "usersBreadcrumb": "Users",
        "searchPlaceholder": "Search by table"
      },
      "userTable": {
        "name": "Name",
        "balance": "Balance",
        "createdUsers": "Created Users",
        "totalDeposits": "Total Deposits",
        "totalWithdrawals": "Total Withdrawals",
        "totalProfit": "Total Profit",
        "avgRtp": "Average RTP",
        "actions": "Actions",
        "noResults": "No results found."
      },
      "rowActions": {
        "actions": "Actions",
        "edit": "Edit",
        "print": "Print",
        "changeBalance": "Change Balance",
        "viewLastTransactions": "View last transactions",
        "history": "History",
        "delete": "Delete"
      },
      "profile": {
        "breadcrumb": "Edit Profile",
        "title": "Account Settings",
        "description": "Manage your profile details and security settings.",
        "generalInfoTab": "General Information",
        "gameSettingsTab": "Game Settings",
        "username": "Username",
        "fullName": "Full Name",
        "role": "Role",
        "memberSince": "Member since",
        "preferredLanguage": "Preferred Language",
        "timezone": "Timezone",
        "phone": "Phone",
        "security": {
          "title": "Security",
          "twoFactor": {
            "label": "Two-factor authentication",
            "description": "Secure your account with an extra verification step."
          }
        },
        "changePassword": {
          "title": "Change Password",
          "oldPassword": "Old Password",
          "newPassword": "New Password",
          "confirmPassword": "Confirm Password"
        },
        "saveChanges": "Save Changes",
        "saving": "Saving...",
        "gameSettings": {
          "connectPoker": "Connect poker players at this level",
          "active": "Active",
          "generalConfig": "General settings",
          "rtp": "RTP",
          "minRate": "Minimum rate",
          "maxTotalBet": "Maximum total bet",
          "demoBalance": "Demo balance",
          "gamesSystem": "Games System",
          "screen": "Screen",
          "room": "The room",
          "egtJackpot": "EGT JACKPOT",
          "slots": "Slots",
          "denomination": "Denomination",
          "igrosoftAmericanPoker": "Igrosoft, American Poker II",
          "aristocratNovomaticMerkur": "Aristocrat, Novomatic, Merkur",
          "novomatic5Lines": "Novomatic (less than 5 lines)",
          "imperiumBet": "ImperiumBet",
          "oneBetPerEvent": "Only one bet per event"
        },
        "successUpdate": {
            "title": "Profile updated",
            "description": "Your changes have been saved successfully."
        },
        "errorLoading": {
            "title": "Error loading profile",
            "description": "Could not get your profile data."
        },
        "errorPasswordMismatch": {
            "title": "Passwords do not match",
            "description": "Please ensure the new password and confirmation match."
        },
        "errorOldPassword": {
            "title": "Old Password Required",
            "description": "You must enter your old password to set a new one."
        },
        "errorNoChanges": {
            "title": "No Changes Detected",
            "description": "You haven't made any changes to save."
        },
        "errorSaving": {
            "title": "Error Saving Profile",
            "description": "Could not save your changes. Please try again."
        }
      },
      "datePicker": {
        "pickDate": "Pick a date"
      },
      "pagination": {
        "previous": "Previous",
        "next": "Next",
        "pageOf": "Page {{currentPage}} of {{totalPages}}"
      },
      "createUserDialog": {
        "title": "Create New User",
        "description": "Complete the following fields to create a new user.",
        "username": "Username",
        "fullName": "Full name",
        "email": "Email",
        "password": "Password",
        "role": "Role",
        "userRole": "User",
        "currency": "Currency",
        "initialBalance": "Initial Balance",
        "cancel": "Cancel",
        "create": "Create",
        "creating": "Creating...",
        "requiredFields": "Required fields",
        "requiredFieldsDesc": "Please complete all required fields.",
        "successTitle": "User Created!",
        "successDesc": "The user \"{{name}}\" has been created successfully.",
        "errorTitle": "Error creating user",
        "errorApi": "Could not connect to the server."
      },
      "createTerminalDialog": {
        "title": "Create New Terminal",
        "description": "Complete the following fields to create a new terminal.",
        "name": "Name",
        "password": "Password",
        "maxBalance": "Maximum balance",
        "balance": "Balance",
        "cancel": "Cancel",
        "create": "Create",
        "requiredFields": "Required fields",
        "requiredFieldsDesc": "Name and password are required.",
        "successTitle": "Success!",
        "successDesc": "Terminal \"{{name}}\" has been created successfully."
      },
      "userManagementDialog": {
        "depositTitle": "Make a Deposit",
        "withdrawTitle": "Make a Withdrawal",
        "description": "Enter the amount to {{action}} for {{name}}. Current balance: {{balance}}",
        "deposit": "deposit",
        "withdraw": "withdraw",
        "amount": "Amount",
        "invalidAmount": "Invalid Amount",
        "invalidAmountDesc": "Please enter a valid positive number.",
        "insufficientFunds": "Insufficient Funds",
        "insufficientFundsDesc": "Cannot withdraw more than the current balance of {{balance}}.",
        "successTitle": "Success!",
        "successDesc": "A {{actionType}} of {{amount}} for {{name}} was successfully processed.",
        "cancel": "Cancel",
        "confirm": "Confirm {{action}}"
      },
      "configurations": {
        "title": "CONFIGURATIONS",
        "from": "From",
        "to": "To",
        "period": "Choose period",
        "today": "Today",
        "yesterday": "Yesterday",
        "thisWeek": "This week",
        "thisMonth": "This month",
        "lastMonth": "Last month",
        "showAll": "Show all",
        "hideInactive": "Hide inactive users",
        "yes": "Yes",
        "totalInOut": "Total In/Out",
        "currency": "Currency",
        "show": "Show"
      },
      "balanceHistory": {
        "breadcrumb": "Balance History",
        "title": "HISTORY",
        "export": "Export to Excel",
        "from": "From",
        "to": "To",
        "fromTime": "From Time",
        "toTime": "To Time",
        "period": "Choose period",
        "today": "Today",
        "yesterday": "Yesterday",
        "thisWeek": "This week",
        "thisMonth": "This month",
        "lastMonth": "Last month",
        "page": "Page:",
        "limits": "Limits:",
        "operationType": "Operation type",
        "toUser": "To user",
        "currency": "Currency",
        "noData": "No data available.",
        "table": {
          "id": "ID",
          "operation": "Operation",
          "deposit": "Deposit",
          "withdraw": "Withdraw",
          "wager": "Wager",
          "betLimit": "Bet limit",
          "balanceBefore": "Balance before operation",
          "currency": "Currency",
          "date": "Date",
          "time": "Time",
          "initiator": "Initiator",
          "fromUser": "From user",
          "system": "System",
          "toUser": "To user",
          "ip": "IP"
        },
        "footer": {
            "total": "Total",
            "winnings": "Winnings"
        }
      },
      "changes": {
        "breadcrumb": "Changes",
        "title": "CHANGES",
        "refresh": "Refresh",
        "from": "From",
        "to": "To",
        "period": "Choose period",
        "today": "Today",
        "yesterday": "Yesterday",
        "thisWeek": "This week",
        "thisMonth": "This month",
        "lastMonth": "Last month",
        "show": "Show",
        "page": "Page:",
        "limits": "Limits:",
        "initiator": "Initiator",
        "noData": "No data available.",
        "table": {
            "id": "ID",
            "initiator": "Initiator",
            "user": "User",
            "page": "Page",
            "action": "Action",
            "changes": "Changes",
            "ip": "IP",
            "date": "Date",
            "time": "Time"
        }
      },
      "intersectionIp": {
        "breadcrumb": "Intersection IP",
        "title": "INTERSECTION IP",
        "ip": "IP",
        "userSearch": "User search",
        "from": "From",
        "to": "To",
        "period": "Choose period",
        "today": "Today",
        "yesterday": "Yesterday",
        "thisWeek": "This week",
        "thisMonth": "This month",
        "lastMonth": "Last month",
        "show": "Show",
        "page": "Page:",
        "limits": "Limits:",
        "noData": "No data available.",
        "table": {
            "users": "Users",
            "dateTime": "Date and time",
            "ip": "IP"
        }
      },
      "providerStatistics": {
        "breadcrumb": "Provider Statistics",
        "title": "PROVIDER STATISTICS",
        "export": "Export to Excel",
        "refresh": "Refresh",
        "from": "From",
        "to": "To",
        "type": "Type",
        "labels": "Labels",
        "currency": "Currency",
        "period": "Choose period",
        "today": "Today",
        "yesterday": "Yesterday",
        "thisWeek": "This week",
        "thisMonth": "This month",
        "lastMonth": "Last month",
        "show": "Show",
        "noData": "No data available.",
        "table": {
            "provider": "Provider",
            "seal": "Seal",
            "bet": "Bet",
            "win": "Win",
            "winnings": "Winnings",
            "wager": "Wager",
            "addedBet": "Added Bet",
            "rtp": "RTP"
        }
      },
      "statistics": {
        "breadcrumb": "Statistics",
        "statsType": "Statistics type",
        "cash": "Cash",
        "convertAmounts": "Convert amounts",
        "showInSelectedCurrency": "Show in selected currency",
        "groupBy": "Group by",
        "superAgent": "Superagent",
        "selectType": "Select type",
        "tableConfig": "Table configuration",
        "selectColumns": "Select columns",
        "periodStart": "Period start",
        "periodEnd": "Period end",
        "period": "Choose period",
        "today": "Today",
        "yesterday": "Yesterday",
        "thisWeek": "This week",
        "addFilterPrompt": "Add a filter or select a template to generate a report",
        "addFilter": "Add filter +",
        "templateNamePlaceholder": "Enter template name",
        "createTemplate": "Create template",
        "savedTemplates": "Saved templates",
        "draft": "Draft",
        "showReport": "Show Report",
        "title": "Statistics",
        "createUser": "Create a user",
        "searchPlaceholder": "Search",
        "noData": "No data available.",
        "table": {
            "userId": "User ID",
            "login": "Login",
            "deposit": "Deposit",
            "withdraw": "Withdraw",
            "winnings": "Winnings",
            "rtp": "RTP",
            "total": "Total"
        }
      },
      "addFilterDialog": {
        "title": "Add Filter",
        "description": "Define a new condition to filter the report.",
        "condition": "Condition",
        "deposit": "Deposit",
        "operator": "Operator",
        "value": "Value",
        "forRow": "For the row",
        "cancel": "Cancel",
        "addFilter": "Add filter",
        "successTitle": "Filter added",
        "successDesc": "Condition added: {{fieldLabel}} {{operatorLabel}} {{value}}."
      },
      "editUser": {
        "title": "Edit user: {{id}}",
        "basics": "Basics",
        "stamp": "Bill stamp",
        "creationDate": "Creation date",
        "id": "ID",
        "login": "Login",
        "note": "Note",
        "notePlaceholder": "show on users page",
        "password": "Password",
        "currentConsignment": "Current consignment",
        "email": "Email",
        "name": "Name",
        "stampNotAvailable": "Bill stamp configuration not available.",
        "cancel": "Cancel",
        "change": "Change",
        "loading": "Loading user...",
        "errorNotFound": "User not found.",
        "success": "User Updated",
        "successDesc": "Data for {{name}} has been saved correctly.",
        "breadcrumb1": "User panel",
        "breadcrumb2": "Edit User"
      },
      "myRooms": {
        "breadcrumb": "My Rooms",
        "title": "MY ROOMS",
        "from": "From",
        "to": "To",
        "all": "All",
        "show": "Show",
        "noData": "No data available.",
        "createRoom": "Create Room",
        "table": {
          "id": "ID",
          "active": "Active",
          "login": "Login",
          "currency": "Currency",
          "totalBet": "Total Bet",
          "totalWin": "Total Win",
          "profit": "Profit",
          "rtp": "RTP",
          "total": "Total"
        }
      },
      "createRoom": {
        "breadcrumb": "Create Room",
        "title": "Create Hall",
        "hallName": "Hall Name",
        "currency": "Currency",
        "integrationType": "Integration Type",
        "create": "Create",
        "creating": "Creating...",
        "cancel": "Cancel",
        "validation": {
            "errorTitle": "Validation Error",
            "title": "Hall name requirements",
            "length": "Between 5 and 25 characters",
            "characters": "Only letters, numbers, underscores, and hyphens",
            "noSpaces": "Cannot contain spaces or special characters"
        },
        "integrationTypes": {
            "seamless": "Seamless",
            "individual": "Individual"
        },
        "success": {
            "title": "Room Created",
            "description": "The room '{{name}}' has been created successfully."
        }
      }
    }
  },
  es: {
    translation: {
      "languages": {
        "en": "Inglés",
        "es": "Español"
      },
      "login": {
        "userLabel": "Ingresar usuario",
        "passwordLabel": "Ingresar password",
        "recoverPassword": "Recuperar contraseña",
        "loginButton": "Iniciar sesión",
        "loggingIn": "Iniciando sesión...",
        "footer": "© 2024 AdminView. Todos los derechos reservados.",
        "successTitle": "Inicio de sesión exitoso",
        "successDescription": "Bienvenido de nuevo, {{name}}.",
        "errorTitle": "Error de inicio de sesión",
        "errorDescription": "Por favor, ingrese su correo y contraseña.",
        "errorApi": "No se pudo conectar con el servidor."
      },
      "header": {
        "searchPlaceholder": "Búsqueda del usuario",
        "toggleSidebar": "Alternar barra lateral",
        "toggleMenu": "Alternar Menú",
        "logout": "SALIR",
        "menuDescription": "Menú principal para la navegación del sitio"
      },
      "sidebar": {
        "users": "USUARIOS",
        "myRooms": "MIS SALAS",
        "createRoom": "CREAR SALA",
        "editProfile": "EDITAR",
        "latestTransactions": "ÚLTIMAS TRANSACCIONES",
        "createUser": "CREAR UN USUARIO",
        "providerStats": "ESTADÍSTICAS DE PROVEEDORES",
        "stats": "ESTADÍSTICAS",
        "gameSettings": "CONFIGURACIÓN DEL JUEGO",
        "changes": "CHANGES",
        "intersectionIp": "INTERSECTION IP"
      },
      "dashboard": {
        "title": "USUARIOS",
        "configurations": "CONFIGURACIONES",
        "usersBreadcrumb": "Usuarios",
        "searchPlaceholder": "Búsqueda por la tabla"
      },
       "userTable": {
        "name": "Nombre",
        "balance": "Balance",
        "createdUsers": "Usuarios Creados",
        "totalDeposits": "Depósitos Totales",
        "totalWithdrawals": "Retiros Totales",
        "totalProfit": "Ganancia Total",
        "avgRtp": "RTP Promedio",
        "actions": "Acciones",
        "noResults": "No se encontraron resultados."
      },
      "rowActions": {
        "actions": "Acciones",
        "edit": "Editar",
        "print": "Imprimir",
        "changeBalance": "Cambiar Balance",
        "viewLastTransactions": "Ver últimas transacciones",
        "history": "Historia",
        "delete": "Eliminar"
      },
      "profile": {
        "breadcrumb": "Editar Perfil",
        "title": "Configuración de la cuenta",
        "description": "Gestiona los detalles de tu perfil y la configuración de seguridad.",
        "generalInfoTab": "Información General",
        "gameSettingsTab": "Configuración del juego",
        "username": "Nombre de usuario",
        "fullName": "Nombre Completo",
        "role": "Rol",
        "memberSince": "Miembro desde",
        "preferredLanguage": "Idioma preferido",
        "timezone": "Zona horaria",
        "phone": "Teléfono",
        "security": {
          "title": "Seguridad",
          "twoFactor": {
            "label": "Autenticación de dos factores",
            "description": "Asegura tu cuenta con un paso de verificación adicional."
          }
        },
        "changePassword": {
          "title": "Cambiar contraseña",
          "oldPassword": "Contraseña anterior",
          "newPassword": "Contraseña nueva",
          "confirmPassword": "Confirmar contraseña"
        },
        "saveChanges": "Guardar Cambios",
        "saving": "Guardando...",
        "gameSettings": {
            "connectPoker": "Conectar a jugadores de póker en este nivel",
            "active": "Activo",
            "generalConfig": "Configuración general",
            "rtp": "RTP",
            "minRate": "Tasa mínima",
            "maxTotalBet": "Apuesta total máxima",
            "demoBalance": "Demo equilibrar",
            "gamesSystem": "Games System",
            "screen": "la pantalla",
            "room": "La sala",
            "egtJackpot": "EGT JACKPOT",
            "slots": "Tragamonedas",
            "denomination": "Denominación",
            "igrosoftAmericanPoker": "Igrosoft, American Poker II",
            "aristocratNovomaticMerkur": "Aristocrat, Novomatic, Merkur",
            "novomatic5Lines": "Novomatic (menos 5 líneas)",
            "imperiumBet": "ImperiumBet",
            "oneBetPerEvent": "Solo una apuesta por evento"
        },
        "successUpdate": {
            "title": "Perfil actualizado",
            "description": "Tus cambios han sido guardados con éxito."
        },
        "errorLoading": {
            "title": "Error al cargar perfil",
            "description": "No se pudieron obtener los datos de tu perfil."
        },
        "errorPasswordMismatch": {
            "title": "Las contraseñas no coinciden",
            "description": "Asegúrese de que la nueva contraseña y la confirmación coincidan."
        },
        "errorOldPassword": {
            "title": "Se requiere contraseña anterior",
            "description": "Debes ingresar tu contraseña anterior para establecer una nueva."
        },
        "errorNoChanges": {
            "title": "No se detectaron cambios",
            "description": "No has realizado ningún cambio para guardar."
        },
        "errorSaving": {
            "title": "Error al guardar el perfil",
            "description": "No se pudieron guardar los cambios. Inténtalo de nuevo."
        }
      },
      "datePicker": {
        "pickDate": "Elegir fecha"
      },
      "pagination": {
        "previous": "Anterior",
        "next": "Siguiente",
        "pageOf": "Página {{currentPage}} de {{totalPages}}"
      },
      "createUserDialog": {
        "title": "Crear Nuevo Usuario",
        "description": "Complete los siguientes campos para crear un nuevo usuario.",
        "username": "Nombre de usuario",
        "fullName": "Nombre completo",
        "email": "Correo electrónico",
        "password": "Contraseña",
        "role": "Rol",
        "userRole": "Usuario",
        "currency": "Divisa",
        "initialBalance": "Balance Inicial",
        "cancel": "Cancelar",
        "create": "Crear",
        "creating": "Creando...",
        "requiredFields": "Campos requeridos",
        "requiredFieldsDesc": "Por favor, complete todos los campos obligatorios.",
        "successTitle": "¡Usuario Creado!",
        "successDesc": "El usuario \"{{name}}\" ha sido creado con éxito.",
        "errorTitle": "Error al crear usuario",
        "errorApi": "No se pudo conectar con el servidor."
      },
      "createTerminalDialog": {
        "title": "Crear Nuevo Terminal",
        "description": "Complete los siguientes campos para crear un nuevo terminal.",
        "name": "Nombre",
        "password": "Contraseña",
        "maxBalance": "Balance máximo",
        "balance": "Balance",
        "cancel": "Cancelar",
        "create": "Crear",
        "requiredFields": "Campos requeridos",
        "requiredFieldsDesc": "El nombre y la contraseña son obligatorios.",
        "successTitle": "¡Éxito!",
        "successDesc": "Se ha creado el terminal \"{{name}}\" con éxito."
      },
      "userManagementDialog": {
        "depositTitle": "Realizar un Depósito",
        "withdrawTitle": "Realizar un Retiro",
        "description": `Ingrese el monto a {{action}} para {{name}}. Saldo actual: {{balance}}`,
        "deposit": "depositar",
        "withdraw": "retirar",
        "amount": "Monto",
        "invalidAmount": "Monto Inválido",
        "invalidAmountDesc": "Por favor, ingrese un número positivo válido.",
        "insufficientFunds": "Fondos Insuficientes",
        "insufficientFundsDesc": "No se puede retirar más que el saldo actual de {{balance}}.",
        "successTitle": "¡Éxito!",
        "successDesc": `Se procesó con éxito un {{actionType}} de {{amount}} para {{name}}.`,
        "cancel": "Cancelar",
        "confirm": "Confirmar {{action}}"
      },
      "configurations": {
        "title": "CONFIGURACIONES",
        "from": "De",
        "to": "A",
        "period": "Elegir el periodo",
        "today": "Hoy",
        "yesterday": "Ayer",
        "thisWeek": "Esta semana",
        "thisMonth": "Este mes",
        "lastMonth": "Mes anterior",
        "showAll": "Mostrar todo",
        "hideInactive": "Esconder a los usuarios inactivos",
        "yes": "Si",
        "totalInOut": "Total Entrada/Salida",
        "currency": "Moneda",
        "show": "Mostrar"
      },
      "balanceHistory": {
        "breadcrumb": "Historia de balance",
        "title": "HISTORIA",
        "export": "Exportar a Excel",
        "from": "De",
        "to": "A",
        "fromTime": "De Hora",
        "toTime": "A Hora",
        "period": "Elegir el periodo",
        "today": "Hoy",
        "yesterday": "Ayer",
        "thisWeek": "Esta semana",
        "thisMonth": "Este mes",
        "lastMonth": "Mes anterior",
        "page": "Página:",
        "limits": "Límites:",
        "operationType": "Tipo operación",
        "toUser": "Al usuario",
        "currency": "Divisa",
        "noData": "No hay datos disponibles.",
        "table": {
          "id": "ID",
          "operation": "Operación",
          "deposit": "Depositar",
          "withdraw": "Retirar",
          "wager": "Wager",
          "betLimit": "Apuesta límite",
          "balanceBefore": "Balance antes de operación",
          "currency": "Divisa",
          "date": "Fecha",
          "time": "Tiempo",
          "initiator": "Iniciador",
          "fromUser": "Del usuario",
          "system": "Sistema",
          "toUser": "Al usuario",
          "ip": "IP"
        },
        "footer": {
            "total": "En total",
            "winnings": "Ganancias"
        }
      },
      "changes": {
        "breadcrumb": "Changes",
        "title": "CHANGES",
        "refresh": "Refrescar",
        "from": "De",
        "to": "A",
        "period": "Elegir el periodo",
        "today": "Hoy",
        "yesterday": "Ayer",
        "thisWeek": "Esta semana",
        "thisMonth": "Este mes",
        "lastMonth": "Mes anterior",
        "show": "Mostrar",
        "page": "Página:",
        "limits": "Límites:",
        "initiator": "Iniciador",
        "noData": "No hay datos disponibles.",
        "table": {
            "id": "ID",
            "initiator": "Iniciador",
            "user": "Usuario",
            "page": "Página",
            "action": "Acción",
            "changes": "Changes",
            "ip": "IP",
            "date": "Fecha",
            "time": "Tiempo"
        }
      },
       "intersectionIp": {
        "breadcrumb": "Intersection IP",
        "title": "INTERSECTION IP",
        "ip": "IP",
        "userSearch": "Búsqueda del usuario",
        "from": "De",
        "to": "A",
        "period": "Elegir el periodo",
        "today": "Hoy",
        "yesterday": "Ayer",
        "thisWeek": "Esta semana",
        "thisMonth": "Este mes",
        "lastMonth": "Mes anterior",
        "show": "Mostrar",
        "page": "Página:",
        "limits": "Límites:",
        "noData": "No hay datos disponibles.",
        "table": {
            "users": "Usuarios",
            "dateTime": "Fecha y hora",
            "ip": "IP"
        }
      },
      "providerStatistics": {
        "breadcrumb": "Estadísticas de proveedores",
        "title": "ESTADÍSTICAS DE PROVEEDORES",
        "export": "Exportar a Excel",
        "refresh": "Refrescar",
        "from": "De",
        "to": "A",
        "type": "Tipo",
        "labels": "Etiquetas",
        "currency": "Divisa",
        "period": "Elegir el periodo",
        "today": "Hoy",
        "yesterday": "Ayer",
        "thisWeek": "Esta semana",
        "thisMonth": "Este mes",
        "lastMonth": "Mes anterior",
        "show": "Mostrar",
        "noData": "No hay datos disponibles.",
        "table": {
            "provider": "Proveedor",
            "seal": "Sello",
            "bet": "Apuesta",
            "win": "Ganar",
            "winnings": "Ganancias",
            "wager": "Wager",
            "addedBet": "Apuesta añadida",
            "rtp": "RTP"
        }
      },
       "statistics": {
        "breadcrumb": "Estadísticas",
        "statsType": "Tipo de estadística",
        "cash": "Efectivo",
        "convertAmounts": "Convertir montos",
        "showInSelectedCurrency": "Mostrar en la moneda seleccionada",
        "groupBy": "Agrupar por",
        "superAgent": "Superagente",
        "selectType": "Seleccionar tipo",
        "tableConfig": "Configuración de tabla",
        "selectColumns": "Seleccionar columnas",
        "periodStart": "Inicio del período",
        "periodEnd": "Fin del período",
        "period": "Elegir el periodo",
        "today": "Hoy",
        "yesterday": "Ayer",
        "thisWeek": "Esta semana",
        "addFilterPrompt": "Agregar un filtro o seleccionar una plantilla para generar un informe",
        "addFilter": "Agregar filtro +",
        "templateNamePlaceholder": "Ingrese el nombre de la plantill",
        "createTemplate": "Crear plantilla",
        "savedTemplates": "Plantillas guardadas",
        "draft": "Borrador",
        "showReport": "Mostrar Informe",
        "title": "Estadísticas",
        "createUser": "Crear un usuario",
        "searchPlaceholder": "Search",
        "noData": "No hay datos disponibles.",
        "table": {
            "userId": "ID de usuario",
            "login": "Login",
            "deposit": "Depositar",
            "withdraw": "Retirar",
            "winnings": "Ganancias",
            "rtp": "RTP",
            "total": "Total"
        }
      },
       "addFilterDialog": {
        "title": "Agregar Filtro",
        "description": "Define una nueva condición para filtrar el informe.",
        "condition": "Condición",
        "deposit": "Depositar",
        "operator": "Operador",
        "value": "Valor",
        "forRow": "Para la fila",
        "cancel": "Cancelar",
        "addFilter": "Agregar filtro",
        "successTitle": "Filtro agregado",
        "successDesc": "Se agregó la condición: {{fieldLabel}} {{operatorLabel}} {{value}}."
      },
      "editUser": {
        "title": "Editar el usuario: {{id}}",
        "basics": "Básicos",
        "stamp": "Sello del billete",
        "creationDate": "Fecha de creación",
        "id": "ID",
        "login": "Login",
        "note": "Nota",
        "notePlaceholder": "mostrar en la página de usuarios",
        "password": "Contraseña",
        "currentConsignment": "Consigna actual",
        "email": "Correo electrónico",
        "name": "Nombre",
        "stampNotAvailable": "Configuración del sello del billete no disponible.",
        "cancel": "Cancelar",
        "change": "Cambiar",
        "loading": "Cargando usuario...",
        "errorNotFound": "Usuario no encontrado.",
        "success": "Usuario Actualizado",
        "successDesc": "Los datos de {{name}} se han guardado correctamente.",
        "breadcrumb1": "Panel de usuarios",
        "breadcrumb2": "Editar Usuario"
      },
      "myRooms": {
        "breadcrumb": "Mis Salas",
        "title": "MIS SALAS",
        "from": "De",
        "to": "A",
        "all": "Todos",
        "show": "Mostrar",
        "noData": "No hay datos disponibles.",
        "createRoom": "Crear Sala",
        "table": {
          "id": "ID",
          "active": "Activo",
          "login": "Login",
          "currency": "Divisa",
          "totalBet": "Apuesta Total",
          "totalWin": "Ganancia Total",
          "profit": "Lucro",
          "rtp": "RTP",
          "total": "Total"
        }
      },
      "createRoom": {
        "breadcrumb": "Crear Sala",
        "title": "Crear Sala",
        "hallName": "Nombre de la sala",
        "currency": "Divisa",
        "integrationType": "Tipo de integración",
        "create": "Crear",
        "creating": "Creando...",
        "cancel": "Cancelar",
        "validation": {
            "errorTitle": "Error de Validación",
            "title": "Requisitos del nombre de la sala",
            "length": "Entre 5 y 25 caracteres",
            "characters": "Solo letras, números, guiones bajos y guiones",
            "noSpaces": "No puede contener espacios ni caracteres especiales"
        },
        "integrationTypes": {
            "seamless": "Seamless",
            "individual": "Individual"
        },
        "success": {
            "title": "Sala Creada",
            "description": "La sala '{{name}}' ha sido creada con éxito."
        }
      }
    }
  }
};


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

    
