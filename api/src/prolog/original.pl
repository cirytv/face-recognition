% Hechos 
% Los hechos incluyen la asistencia de cada estudiante para cada fecha, además de información sobre grupos, materias, retardos, y penalizaciones por asistencia insuficiente.

% Estudiantes registrados
estudiante(nombre, id).

% Ejemplos de estudiantes registrados
estudiante('Juan Pérez', 1).
estudiante('María López', 2).
estudiante('Carlos Díaz', 3).

% Asistencia de cada estudiante en una fecha específica
asistencia(id_estudiante, fecha, estado).

% Ejemplos:
asistencia(1, '2024-10-29', presente).
asistencia(2, '2024-10-29', ausente).
asistencia(3, '2024-10-29', presente).
asistencia(1, '2024-10-30', presente).
asistencia(2, '2024-10-30', presente).
asistencia(3, '2024-10-30', ausente).

% Total de días de clase
total_dias_clase(2).

% Grupos y materias
grupo(id_grupo, nombre_grupo).
materia(id_materia, nombre_materia, hora_inicio, hora_fin).

% Ejemplos:
grupo(1, 'Grupo A').
grupo(2, 'Grupo B').

materia(1, 'Matemáticas', '08:00', '09:00').
materia(2, 'Historia', '10:00', '11:00').

% Registro de retardos
retardo(id_estudiante, fecha, tiempo).

% Ejemplo:
retardo(1, '2024-10-30', 15).

% Definición de umbral para retardo
umbral_retardo(15).  % Un retardo ocurre si el estudiante llega 15 minutos tarde o más.

% Porcentaje de asistencia aceptable
umbral_asistencia(80).  % Un estudiante debe tener al menos el 80% de asistencia.

% Día con más inasistencias por estudiante
inasistencias_dia_estudiante(id_estudiante, dia, cantidad).
% Este hecho se puede calcular dinámicamente.

% Reglas 

% 1. Consultar si un estudiante estuvo presente en una fecha
estuvo_presente(Nombre, Fecha) :-
    estudiante(Nombre, Id),
    asistencia(Id, Fecha, presente).

% 2. Consultar la lista de estudiantes presentes en una fecha específica
presentes_en_fecha(Fecha, ListaEstudiantes) :-
    findall(Nombre, (asistencia(Id, Fecha, presente), estudiante(Nombre, Id)), ListaEstudiantes).

% 3. Consultar la asistencia de un estudiante en todas las fechas
asistencia_estudiante(Nombre, ListaAsistencias) :-
    estudiante(Nombre, Id),
    findall((Fecha, Estado), asistencia(Id, Fecha, Estado), ListaAsistencias).

% 4. Contar la cantidad de asistencias de un estudiante
contar_asistencias(Nombre, Cantidad) :-
    estudiante(Nombre, Id),
    findall(Fecha, asistencia(Id, Fecha, presente), ListaFechas),
    length(ListaFechas, Cantidad).

% 5. Calcular el porcentaje de asistencia de un estudiante
porcentaje_asistencia(Nombre, Porcentaje) :-
    estudiante(Nombre, Id),
    findall(Fecha, asistencia(Id, Fecha, presente), FechasAsistencia),
    length(FechasAsistencia, CantidadAsistencias),
    total_dias_clase(TotalDias),
    Porcentaje is (CantidadAsistencias / TotalDias) * 100.

% 6. Determinar si un estudiante está dentro del umbral de asistencia aceptable
asistencia_regular(Nombre) :-
    porcentaje_asistencia(Nombre, Porcentaje),
    umbral_asistencia(Umbral),
    Porcentaje >= Umbral.

% 7. Listar estudiantes con retardos en una fecha específica
estudiantes_con_retardo(Fecha, ListaEstudiantes) :-
    findall(Nombre, (retardo(Id, Fecha, Tiempo), umbral_retardo(Umbral), Tiempo >= Umbral, estudiante(Nombre, Id)), ListaEstudiantes).

% 8. Determinar el día con más inasistencias de un estudiante
dia_mas_inasistencias(Nombre, Dia) :-
    estudiante(Nombre, Id),
    findall(Dia, (asistencia(Id, Fecha, ausente), day_of_week(Fecha, Dia)), DiasAusencia),
    msort(DiasAusencia, DiasOrdenados),
    max_count(DiasOrdenados, Dia).

 
%Ejemplo de Uso
%Algunas consultas en Prolog podrían verse así:

% Ejemplo de Uso

% 1. ¿Juan Pérez estuvo presente el 2024-10-29?
%?- estuvo_presente('Juan Pérez', '2024-10-29').

% 2. Lista de estudiantes presentes el 2024-10-29
%?- presentes_en_fecha('2024-10-29', ListaEstudiantes).

% 3. Asistencia de María López en todas las fechas
%?- asistencia_estudiante('María López', ListaAsistencias).

% 4. Número de veces que Carlos Díaz estuvo presente
%?- contar_asistencias('Carlos Díaz', Cantidad).

% 5. Porcentaje de asistencia de Juan Pérez
%?- porcentaje_asistencia('Juan Pérez', Porcentaje).

% 6. ¿María López tiene una asistencia regular?
%?- asistencia_regular('María López').

% 7. Estudiantes con retardos el 2024-10-30
%?- estudiantes_con_retardo('2024-10-30', ListaEstudiantes).

% 8. Día con más inasistencias de Carlos Díaz
% ?- dia_mas_inasistencias('Carlos Díaz', Dia).


