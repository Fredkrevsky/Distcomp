import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { StickerService } from './Sticker.service';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { StickerResponseTo } from './Dto/StickerResponseTo';
import { Sticker } from 'src/entities/Sticker';
import { StickerRequestTo, UpdateStickerTo } from './Dto/StickerRequestTo';

@Controller('api/v1.0/stickers')
export class StickerController {
  constructor(private readonly stickerService: StickerService) {}

  @Get()
  async getAll(@Res() res: Response) {
    const stickers: ReadonlyArray<Sticker> =
      await this.stickerService.getAllStickers();
    res.status(HttpStatus.OK).json(
      plainToInstance(StickerResponseTo, stickers, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Post()
  async create(@Body() body: StickerRequestTo, @Res() res: Response) {
    const sticker = await this.stickerService.createSticker(body);
    res.status(HttpStatus.CREATED).json(
      plainToInstance(StickerResponseTo, sticker, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) stickerId: number,
    @Res() res: Response,
  ) {
    await this.stickerService.deleteSticker(stickerId);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) stickerId: number,
    @Res() res: Response,
  ) {
    const sticker = await this.stickerService.getStickerById(stickerId);
    res.status(HttpStatus.OK).json(
      plainToInstance(StickerResponseTo, sticker, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Put()
  async update(@Body() req: UpdateStickerTo, @Res() res: Response) {
    const sticker = await this.stickerService.updateSticker(req);
    const responseData: StickerResponseTo = {
      ...sticker,
      id: Number(sticker.id),
    };
    res.status(HttpStatus.OK).json(
      plainToInstance(StickerResponseTo, responseData, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
