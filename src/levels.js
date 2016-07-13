var level_1 = {
    startPoints:[2],
    endPoints:[0],
    tubeData: [
        [T_TUBE, I_TUBE, T_TUBE, I_TUBE, L_TUBE, L_TUBE, I_TUBE, NO_TUBE],
        [L_TUBE, T_TUBE, T_TUBE, X_TUBE, T_TUBE, L_TUBE, I_TUBE, X_TUBE],
        [NO_TUBE, L_TUBE, I_TUBE, L_TUBE, T_TUBE, L_TUBE, X_TUBE, T_TUBE],
        [T_TUBE, T_TUBE, T_TUBE, T_TUBE, L_TUBE, I_TUBE, L_TUBE, X_TUBE],
        [L_TUBE, L_TUBE, I_TUBE, L_TUBE, L_TUBE, T_TUBE, L_TUBE, L_TUBE]
    ]
};

game.loadLevel(level_1.tubeData[0].length, level_1.tubeData.length, level_1);
