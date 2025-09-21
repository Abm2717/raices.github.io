export let valoresTabla = [];

export function biseccion(f, xi, xf, eamax) {
    valoresTabla.length = 0; 
    let fxi = f(xi);
    let fxf = f(xf);
    let xr, xrAnterior, fxr, error;
    let iteraciones = 0;
    
    if (fxi * fxf > 0) {
        return { mensaje: "Intervalo invalido: no hay raiz en este rango." }
    }
    
    while (true) {
        xrAnterior = xr;
        xr = (xi + xf) / 2;
        fxr = f(xr);
        let producto = fxi * fxr;
        iteraciones++;

        if (iteraciones > 1) {
            error = Math.abs((xr - xrAnterior) / xr) * 100;
        } else {
            error = 100;
        }

        valoresTabla.push({
            xi: parseFloat(xi.toFixed(6)),
            xf: parseFloat(xf.toFixed(6)),
            fxi: parseFloat(fxi.toFixed(6)),
            fxf: parseFloat(fxf.toFixed(6)),
            xr: parseFloat(xr.toFixed(6)),
            fxr: parseFloat(fxr.toFixed(6)),
            prod: parseFloat(producto.toFixed(6)),
            ea: parseFloat(error.toFixed(6))
        });

        if (error < eamax) {
            return {
                raiz: parseFloat(xr.toFixed(6)),
                f_raiz: parseFloat(fxr.toFixed(6)),
                error: parseFloat(error.toFixed(6)),
                iteraciones: iteraciones,
                tabla: valoresTabla
            };
        }
        
        if (iteraciones >= 100) {
            return {
                mensaje: "No se encontro la raiz en 100 iteraciones."
            };
        }

        if (producto < 0) {
            xf = xr;
            fxf = fxr;
        } else {
            xi = xr;
            fxi = fxr;
        }
    }
}

export function reglaFalsa(f, xi, xf, eamax) {
    valoresTabla.length = 0;
    
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
        let producto = fxi * fxr;
        iteraciones++;

        if (iteraciones > 1) {
            error = Math.abs((xr - xrAnterior) / xr) * 100;
        } else {
            error = 100; 
        }

        valoresTabla.push({
            xi: parseFloat(xi.toFixed(6)),
            xf: parseFloat(xf.toFixed(6)),
            fxi: parseFloat(fxi.toFixed(6)),
            fxf: parseFloat(fxf.toFixed(6)),
            xr: parseFloat(xr.toFixed(6)),
            fxr: parseFloat(fxr.toFixed(6)),
            prod: parseFloat(producto.toFixed(6)),
            ea: parseFloat(error.toFixed(6))
        });

        if (error < eamax) {
            return {
                raiz: parseFloat(xr.toFixed(6)),
                f_raiz: parseFloat(fxr.toFixed(6)),
                error: parseFloat(error.toFixed(6)),
                iteraciones: iteraciones,
                tabla: valoresTabla
            };
        }
 
        if (iteraciones >= 100) {
            return {
                mensaje: "No se encontro la raiz en 100 iteraciones."
            };
        }

        if (producto < 0) {
            xf = xr;
            fxf = fxr;
        } else {
            xi = xr;
            fxi = fxr;
        }
    }
}