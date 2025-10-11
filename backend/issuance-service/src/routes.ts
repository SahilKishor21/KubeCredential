import { Router, Request, Response } from 'express';
import { IssuanceService } from './service';
import { credentialSchema } from './validators';
import { ApiResponse } from './types';

const router = Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Issuance service is healthy',
    data: { workerId: IssuanceService.getWorkerId() },
  });
});

// Issue credential
router.post('/issue', (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = credentialSchema.parse(req.body);

    // Issue credential
    const issuedCredential = IssuanceService.issueCredential(validatedData);

    const response: ApiResponse = {
      success: true,
      message: `Credential issued by ${issuedCredential.issuedBy}`,
      data: issuedCredential,
    };

    res.status(201).json(response);
  } catch (error: any) {
    if (error.message === 'Credential already issued') {
      const response: ApiResponse = {
        success: false,
        message: 'Credential already issued',
        error: error.message,
      };
      return res.status(409).json(response);
    }

    if (error.name === 'ZodError') {
      const response: ApiResponse = {
        success: false,
        message: 'Validation error',
        error: error.errors.map((e: any) => e.message).join(', '),
      };
      return res.status(400).json(response);
    }

    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
      error: error.message,
    };
    res.status(500).json(response);
  }
});

// Get credential by ID
router.get('/credentials/:id', (req: Request, res: Response) => {
  try {
    const credential = IssuanceService.getCredential(req.params.id);

    if (!credential) {
      const response: ApiResponse = {
        success: false,
        message: 'Credential not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Credential retrieved successfully',
      data: credential,
    };

    res.json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
      error: error.message,
    };
    res.status(500).json(response);
  }
});

// Get all credentials
router.get('/credentials', (req: Request, res: Response) => {
  try {
    const credentials = IssuanceService.getAllCredentials();

    const response: ApiResponse = {
      success: true,
      message: 'Credentials retrieved successfully',
      data: credentials,
    };

    res.json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
      error: error.message,
    };
    res.status(500).json(response);
  }
});

export default router;