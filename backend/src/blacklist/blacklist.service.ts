import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class BlacklistService {
	private cached_blacklist: string[] = [];
	private _blacklist;

	constructor(
		private readonly redis: RedisService,
	) {
		this._blacklist = this.redis.db;
	}

	public blacklist(token: string) {
		this._blacklist.set(token, true, 'EX', parseInt(process.env.EXPIRESIN));
		this.cached_blacklist.push(token);
	}

	async blacklisted(token: string): Promise<boolean> {
		if (this.cached_blacklist.includes(token)) return true;
		return !!(await this._blacklist.get(token));
	}
}
