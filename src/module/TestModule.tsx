import { SessionStorage, Update } from '@/Component/Redux/index';

class TestModule {
    @SessionStorage
    num = 1;
    @Update
    private update(): void {}

    updataNumber(num: number): void {
        this.num = num;
        this.update();
    }
}
export default new TestModule();
