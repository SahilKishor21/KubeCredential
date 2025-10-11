import { Router, Request, Response } from 'express';
import { VerificationService } from './service';
import { ApiResponse } from './types';
import { z } from 'zod';

const router = Router();

const verifySchema = z.object({
  id: z.string().min(1, 'Credential ID is required'),
});

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Verification service is healthy',
    data: { workerId: VerificationService.getWorkerId() },
  });
});

// Verify credential
router.post('/verify', async (req: Request, res: Response) => {
  try {
    // Validate input
    const { id } = verifySchema.parse(req.body);

    // Verify credential
    const result = await VerificationService.verifyCredential(id);

    const response: ApiResponse = {
      success: result.valid,
      message: result.message,
      data: result,
    };

    res.json(response);
  } catch (error: any) {
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
      message: 'Verification failed',
      error: error.message,
    };
    res.status(500).json(response);
  }
});

// Get verification logs
router.get('/logs', (req: Request, res: Response) => {
  try {
    const credentialId = req.query.credentialId as string | undefined;
    const logs = VerificationService.getVerificationLogs(credentialId);

    const response: ApiResponse = {
      success: true,
      message: 'Logs retrieved successfully',
      data: logs,
    };

    res.json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to retrieve logs',
      error: error.message,
    };
    res.status(500).json(response);
  }
});

export default router;