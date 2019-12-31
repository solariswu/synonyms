import React from 'react';
import { Spinner } from 'react-bootstrap';

export const Loading = () => {
    return (
        <div className="d-flex justify-content-center align-items-center">
        <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Loading...
          </div>
    );
}