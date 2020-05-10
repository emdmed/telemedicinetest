- probar consultorio de dermato

paciente: enrique.darderes@gmail.com 32609598
medico: dermato@hcjsm.com 1111

[x] - consultorios
    [x] - dejar que el medico finalice la llamada
        [x] - eliminar paciente de waitinglist del consultorio **testear esto


[x] - mandar alert y borrar turno
[x] - al sacar turno eliminar los otros servicios del DOM
[] - handle cuando turno es true en localstorage, sacar los turnos de los servicios nos correspondientes del DOM

Domingo
[] - consultorio clinica
[] - consultorio cirugia

SECURITY
[] - avoid someone entering consultorioClinica.htlm and seeing the consultation
    *check if he is on the turn list and in what index, if index not 0 alert and redirect
    