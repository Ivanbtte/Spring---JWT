package com.unsis.spring.app.Service.BD1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class TrimestreScheduler {
    @Autowired
    private TrimestreServiceImpl trimestreService;

    @Scheduled(cron = "0 0 0 1 * *") // Se ejecuta el primer día de cada mes a la medianoche
    public void checkAndCreateTrimestre() {
        trimestreService.generarTrimestreSiEsNecesario();
    }
}
