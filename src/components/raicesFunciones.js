
export function biseccion(f, xi, xf, eamax) {
    
    let fxi = f(xi);
    let fxf = f(xf);
    let xr, fxr, error;
    let iteraciones = { value: 0 };
    if (fxi * fxf > 0) {
        return { mensaje: "Intervalo invalido: no hay raiz en este rango." }
    }
    while (true) {
        xr = (xi + xf) / 2;
        fxr = f(xr);

        iteraciones.value++;

        if (iteraciones.value > 1) {
        error = Math.abs((xf - xi) / xr) * 100;
        } else {
        error = 100;
        }

        if (error < eamax) {
        return {
            raiz: parseFloat(xr.toFixed(6)),
            f_raiz: parseFloat(fxr.toFixed(6)),
            error: parseFloat(error.toFixed(6)),
            iteraciones: iteraciones
        };
        }

        // POr si se va de mas
        if (iteraciones.value >= 100) {
        return {
            mensaje: "No se encontro la raiz en 100 iteraciones."
        };
        }

        if (fxi * fxr < 0) {
        xf = xr;
        fxf = fxr;
        } else {
        xi = xr;
        fxi = fxr;
        }
    }
}


export function reglaFalsa(f, xi, xf, eamax) {
    
    let fxi = f(xi);
    let fxf = f(xf);
    let xr, xrAnterior, fxr, error;
    let iteraciones = 0;
    if (fxi * fxf > 0) {
        return { mensaje: "Intervalo invalido: no hay raiz en este rango." }
    }

    while (true) {
        xrAnterior = xr;

        xr = (xi * fxf - xf * fxi) / (fxf - fxi);
        fxr = f(xr);

        iteraciones++;

        if (iteraciones > 1) {
        error = Math.abs(xr - xrAnterior);
        } else {
        error = 100; 
        }

        if (error < eamax) {
        return {
            raiz: parseFloat(xr.toFixed(6)),
            f_raiz: parseFloat(fxr.toFixed(6)),
            error: parseFloat(error.toFixed(6)),
            iteraciones: iteraciones
        };
        }

        //por si acaso
        if (iteraciones >= 100) {
        return {
            mensaje: "No se encontro la raiz en 100 iteraciones."
        };
        }

        if (fxi * fxr < 0) {
        xf = xr;
        fxf = fxr;
        } else {
        xi = xr;
        fxi = fxr;
        }
    }
}
