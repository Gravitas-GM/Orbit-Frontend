import { Button, H1 } from "@blueprintjs/core";
import { useCallback, useContext, useState } from "react";
import { GamesModel } from "../../../Api/Game-State/Models/Games";
import { UserContext } from "../../../Session";
import * as toaster from "../../../Toaster";

export const DebugControls = () => {
    const User = useContext(UserContext);
    const [processing, setIsProcessing ]= useState(false);

    const onStopGameClick = useCallback(async ()=> {
        setIsProcessing(true);

        try {
            await GamesModel.deleteGameState(User!.account.id);

            toaster.success('Current Game has been stopped');
        } catch {
         toaster.error('There was an error while trying to cancel the current game.');
        }

        setIsProcessing(false);
    }, []);

    return (
        <div className="gm-page-wrapper">
            <H1>Debug Controls</H1>
  
            <Button 
                loading={processing}
                onClick={onStopGameClick}
            >
                Stop Current Game
            </Button>
        </div>
    );
}