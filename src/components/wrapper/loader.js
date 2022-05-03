import React from 'react';
import {Spinner} from 'reactstrap';

export const Loader = () => (
    <div className="olay">
        <div className="text-center">
        <Spinner color="default" className="default-color" />
        </div>
    </div>
)
